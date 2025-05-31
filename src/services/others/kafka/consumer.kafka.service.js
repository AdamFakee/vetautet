const { sequelize } = require('../../../configs/database.config');
const { redisConst } = require('../../../consts/redis.const');
const { ConflictRequestError } = require('../../../core/error.response');
const { redisHelper } = require('../../../helpers/redis.helper');
const { ticketService } = require('../../database/ticket.service');
const { ticketPurchaseService } = require('../../database/ticketPurchase.service');
const { redisService } = require('../redis.service');
const { Kafka } = require('kafkajs');


const kafka = new Kafka({
    clientId: 'train-ticket-consumer',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    requestTimeout: 25000,
    connectionTimeout: 3000,
    enforceRequestTimeout: false,
    retry: {
        initialRetryTime: 200,
        retries: 8,
        maxRetryTime: 4000,
    },
});
const consumer = kafka.consumer({ groupId: 'ticket-processing-group' });


class TicketConsumer {
    async start() {
        await consumer.connect();

        await consumer.subscribe({ topics: [
            'ticket-hold',
            'ticket-release',
            'payment-success',
            // 'payment-failed',
        ]});

        console.log('ok')
        await consumer.run({
            partitionsConsumedConcurrently: 7,
            eachMessage: async ({ topic, partition, message }) => {
                console.log('reund')
                const data = JSON.parse(message.value.toString());
                console.log(` Processing ${topic}:`, data);

                try {
                    switch (topic) {
                        case 'ticket-hold':
                            await this.handleTicketHold(data);
                            break;
                        case 'ticket-release':
                            await this.handleTicketRelease(data);
                            break;
                        case 'payment-success':
                            await this.handlePaymentSuccess(data);
                            break;
                        // case 'payment-failed':
                        //     await this.handlePaymentFailed(data);
                        //     break;
                    }
                } catch (error) {
                    console.error(`Error processing ${topic}:`, error);
                }
            }
        });
    }

    async handleTicketHold(data) {
        console.log('hold')
        const { ticketId, userId, direction } = data;
        // const { TICKET_PENDING, TICKET_PENDING_TTL  } = redisConst.hash;

        // const transaction = await sequelize.transaction();
        try {
            console.log('start holding:::', data)
            await ticketService.editOneTicketByTicketId(ticketId, direction, {
                status: 'pending',
            })
            // await transaction.commit();

            // // ticketId = userId  
            // await redisService.setHash(TICKET_PENDING, ticketId, userId, TICKET_PENDING_TTL);
        } catch (e) {
            console.log('holding::::err::::', e)
            // await transaction.rollback()
            throw e
        } 
    }

    async handleTicketRelease(data) {
        console.log('start realase:::', data)
        const { ticketId, userId, direction } = data;
        
        const { TICKET_PENDING } = redisConst.hash;

        // field name in redis hash
        // const ticketField = redisHelper.createTicketFieldName(ticketId, userId);
        
        // const transaction = await sequelize.transaction();
        try {
            await ticketService.editOneTicketByTicketId(ticketId, direction, {
                status: 'available',
            })

            // await transaction.commit();

            // await redisService.delFieldInHashByFieldName(TICKET_PENDING, ticketField)
        } catch (e) {
            // await transaction.rollback()
            console.log('release::::err::::', e)
        }
    }

    async handlePaymentSuccess(data) {
        console.log('start payment:::', data)
        const { ticketId, userId, direction } = data;
        
        const { TICKET_PENDING, TICKET_SOLD } = redisConst.hash;

        // field name in redis hash
        // const ticketField = redisHelper.createTicketFieldName(ticketId, userId);

        // const ticketHolded = await redisService.getHashByFieldName(TICKET_PENDING, ticketField)

        // if(!ticketHolded) {
        //     throw ConflictRequestError('err::: không giữ vé nên không thể thanh toán được');
        // }
        
        // const transaction = await sequelize.transaction();
        try {
            await ticketService.editOneTicketByTicketId(ticketId, direction, {
                status: 'booked',
            })

            await ticketPurchaseService.createTicketPurchase({
                user_id: userId, ticket_id: ticketId, ...data
            })

            // await transaction.commit();

            // await redisService.setString(ticketId, ticket, redisConst.string.TTL)
            // await redisService.delFieldInHashByFieldName(TICKET_PENDING, ticketField)
        } catch (e) {
            console.log('payment::::err::::', e)
            // await redisService.delFieldInHashByFieldName(TICKET_SOLD, ticketId)
            // await transaction.rollback()
        }
    }

    // async handlePaymentFailed(data) {
    //     console.log('start payment false:::', data)
    //     const { ticketId, userId } = data;
        
    //     const { TICKET_PENDING } = redisConst.hash;

    //     // field name in redis hash
    //     const ticketField = redisHelper.createTicketFieldName(ticketId, userId);

    //     return await redisService.delFieldInHashByFieldName(TICKET_PENDING, ticketField)
    // }

}


module.exports = {
    TicketConsumer
};