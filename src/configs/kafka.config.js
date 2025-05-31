const { Kafka } = require('kafkajs');

class KafkaConfig {
    static instance = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new KafkaConfig().initial();
        }
        console.log('akfksa::::', this.instance.producer)
        return this.instance;
    }

    initial() {
        return new Kafka({
            clientId: 'vetautet',
            brokers: ['localhost:9092'],
            requestTimeout: 25000,
            connectionTimeout: 3000,
            enforceRequestTimeout: false,
            retry: {
                initialRetryTime: 200,
                retries: 8,
                maxRetryTime: 4000,
            },
        });
    }
}

module.exports = KafkaConfig;