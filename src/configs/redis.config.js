const { createClient } = require('redis');

class RedisConfig {
    static async getConnection() {
        if( this.instance ) {
            return this.instance;
        }
        console.log("redis   ")
        return this.instance = new RedisConfig().connection();
    }
    async connection () {
        const client = createClient();        
        return this.instance = await client.on("error", (err) => console.log("Redis Client Error", err)).connect();
    }
}

module.exports = { RedisConfig };
