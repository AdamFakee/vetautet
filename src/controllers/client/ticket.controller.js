'use strict';

const { redisConst } = require("../../consts/redis.const");
const { NotFoundError, BadRequestError, ConflictRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { ticketService } = require("../../services/database/ticket.service");
const { EVENTS, kafkaProducer } = require("../../services/others/kafka/producer.kafka.service");
const { redisService } = require("../../services/others/redis.service");
const getAllTicketsByScheduleId = async (req, res, next) => {
    const { scheduleId } = req.params;
    if(!scheduleId) {
        return new BadRequestError('Errr:::: not contain scheduleId').send(res);
    }

    const redisKeyForAllTicketsByScheduleId = 'TICKET_ALL_BY_SCHEDULE_ID::' + `scheduleId=${scheduleId}`;
    let tickets = await redisService.getString(redisKeyForAllTicketsByScheduleId);
    if(tickets && tickets.length > 0) {
        const metadata = {
            tickets
        };

        return new OK({metadata}).send(res);
    }
    tickets = await ticketService.getAllTicketsByScheduleId(scheduleId);
    if(tickets.length === 0) {
        return new NotFoundError('Err::: not found tickets').send(res);
    }

    await redisService.setString(redisKeyForAllTicketsByScheduleId, tickets, 10000); // 10k senconds


    const metadata = {
        tickets
    }

    return new OK({metadata}).send(res)
}

const getOneTicketByTicketId = async (req, res, next) => {
    const { ticketId, direction } = req.params;
    if(!ticketId || !direction) {
        return new BadRequestError('Errr:::: not contain ticketId or direction').send(res);
    }

    const ticketRedis = await redisService.getString(ticketId);
    if(ticketRedis) {
        const metadata = {
            ticketRedis
        }

        return new OK({metadata}).send(res)
    }

    const ticket = await ticketService.getOneTicketByTicketId(ticketId, direction);
    if(!ticket) {
        return new NotFoundError('Err::: not found ticket').send(res);
    }

    await redisService.setString(ticketId, ticket)
    const metadata = {
        ticket
    }

    return new OK({metadata}).send(res)
}

const hodlingTicketForPayment = async (req, res, next) => {
    const { user_id } = req.user;
    const { ticketId, direction } = req.params;
    if(!ticketId || !user_id) {
        return new BadRequestError('Errr:::: not contain ticketId or user_id').send(res);
    }

    const { TICKET_PENDING, TICKET_PENDING_TTL, TICKET_SOLD  } = redisConst.hash;

    // field name in redis hash : ticketId  = userId
    const ticketHolded = await redisService.getHashByFieldName(TICKET_PENDING, ticketId)

    if(ticketHolded) {
        console.log(ticketHolded)
        return new ConflictRequestError('err::: ban dang giu ve nay').send(res);
    }

    const ticketSold = await redisService.getHashByFieldName(TICKET_SOLD, ticketId, user_id)
    if(ticketSold) {
        console.log(ticketSold)
        return new ConflictRequestError('err::: ve da ban').send(res);
    }

    let ticket = await redisService.getString(ticketId);
    // không tồn tại trong redis 
    if(!ticket) {
        ticket = await ticketService.getOneTicketByTicketId(ticketId, direction, {
            status: 'available'
        })

        // luu vao cache voi trang thai pending
        if(ticket) {
            ticket.status = 'pending'
            await redisService.setString(ticketId, ticket, redisConst.string.TTL);
        } else {
            return new NotFoundError('err::::vé đã bán hoặc đã được người khác giữ::::' + ticketId).send(res)
        }
    } else {
        if(ticket.status == 'available') {
            ticket.status = 'pending'
            await redisService.setString(ticketId, ticket, redisConst.string.TTL);
        }
    }
    await redisService.setHash(TICKET_PENDING, ticketId, user_id, TICKET_PENDING_TTL);

    console.log('ticket:::', ticket)
    // gui message len kafka 
    const message = {
        type: EVENTS.TICKET_HOLD,
        userId: user_id,
        ticketId: String(ticketId),
        direction: ticket.shard_key
    }
    console.log('ess::', message)
    await kafkaProducer.sendEvent('ticket-hold', message);


    const metadata = {
        ticketId, ticket
    }
    return new OK({
        metadata
    }).send(res)
}

const cancelHoldingTicket = async (req, res, next) => {
    const { user_id } = req.user;
    const { ticketId } = req.params;

    if(!ticketId || !user_id) {
        return new BadRequestError('Errr:::: missing user_id or ticket_id').send(res);
    }

    const { TICKET_PENDING } = redisConst.hash;
    
    // field name in redis hash

    const ticketHolded = await redisService.getHashByFieldName(TICKET_PENDING, ticketId)

    if(!ticketHolded) {
        return new ConflictRequestError('err::: ban không phai la nguoi giữ vé').send(res);
    }

    let ticket = await redisService.getString(ticketId);
    // không tồn tại trong redis 
    if(!ticket) {
        ticket = await ticketService.getOneTicketByTicketId(ticketId, {
            status: 'pending'
        })

        // luu vao cache voi trang thai pending
        if(ticket) {
            ticket.status = 'available'
            await redisService.setString(ticketId, ticket, redisConst.string.TTL);
        } else {
            return new NotFoundError('err::::không tìm thấy vé::::' + ticketId).send(res)
        }
    } else {
        if(ticket.status == 'pending') {
            ticket.status = 'available';
            await redisService.setString(ticketId, ticket, redisConst.string.TTL)
        } else {
            throw new ConflictRequestError('err:: trạng thái không khớp :::::' + ticket).send(res)
        }
    }

    // xoá trong hash 
    await redisService.delFieldInHashByFieldName(TICKET_PENDING, ticketId)



    const message = {
        type: EVENTS.TICKET_RELEASE,
        userId: user_id,
        ticketId: String(ticketId),
        direction: ticket.shard_key
    }
    await kafkaProducer.sendEvent('ticket-release', message);

    const metadata = {
        ticketId
    }
    return new OK({
        metadata
    }).send(res)
}

const payment = async (req, res, next) => {
    const { user_id } = req.user;
    const { ticketId } = req.params;

    if(!ticketId || !user_id) {
        return new BadRequestError('Errr:::: cần báo cho bên thanh toán hoàn tiền lại cho khách').send(res);
    }

    const { TICKET_PENDING, TICKET_SOLD, TICKET_SOLD_TTL } = redisConst.hash;
    
    const ticketHolded = await redisService.getHashByFieldName(TICKET_PENDING, ticketId)

    if(!ticketHolded) {
        return new ConflictRequestError('err::: không giữ vé nên không thể thanh toán được').send(res);
    }


    let ticket = await redisService.getString(ticketId);
    // không tồn tại trong redis 
    if(!ticket) {
        ticket = await ticketService.getOneTicketByTicketId(ticketId, {
            status: 'pending'
        })

        // luu vao cache voi trang thai pending
        if(ticket) {
            ticket.status = 'booked'
            await redisService.setString(ticketId, ticket, redisConst.string.TTL);
        } else {
            return new NotFoundError('err::::không tìm thấy vé::::' + ticketId).send(res)
        }
    } else {


        // check in redis hash nx + del in pendding
        const resuslt = await redisService.setHashNX(TICKET_SOLD, ticketId, user_id, TICKET_SOLD_TTL)

        if(resuslt == false) {
            return new ConflictRequestError('err::: vé đã được mua bởi người khác')
        }

        if(ticket.status == 'pending') {
            ticket.status = 'booked';
            await redisService.delFieldInHashByFieldName(TICKET_PENDING, ticketId)
            await redisService.setString(ticketId, ticket, redisConst.string.TTL)
        } else {
            throw new ConflictRequestError('err:: trạng thái vé không khớp:::::' + resuslt,).send(res);
        }
    }


    const message = {
        type: EVENTS.PAYMENT_SUCCESS,
        userId: user_id,
        ticketId: String(ticketId),
        direction: ticket.shard_key
    }
    await kafkaProducer.sendEvent('payment-success', message);
    
    return new OK({}).send(res)
}


module.exports.ticketClientController = {
    getAllTicketsByScheduleId, getOneTicketByTicketId, hodlingTicketForPayment, payment,
    cancelHoldingTicket
}