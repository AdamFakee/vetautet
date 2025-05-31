const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'train-ticket-producer',
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

const producer = kafka.producer();

class KafkaProducer {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            await producer.connect();
            this.isConnected = true;
        }
    }

    async sendEvent(topic, message) {
        try {
            console.log('sendmessss')
            await this.connect();
            await producer.send({
                topic,
                messages: [{
                    key: String(message.userId || 'system'),
                    value: JSON.stringify({
                        ...message,
                    })
                }]
            });
        } catch (error) {
            console.error(`Failed to send event to ${topic}:`, error);
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await producer.disconnect();
            this.isConnected = false;
        }
    }
}

const kafkaProducer = new KafkaProducer();

// Event types
const EVENTS = {
  USER_LOGIN: 'user-login',
  TICKET_SEARCH: 'ticket-search',
  TICKET_HOLD: 'ticket-hold',
  TICKET_RELEASE: 'ticket-release',
  PAYMENT_INITIATED: 'payment-initiated',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
};

module.exports = { kafkaProducer, EVENTS }