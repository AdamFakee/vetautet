const { RedisConfig } = require("../../configs/redis.config");

class RedisService {
    constructor() {
        this.redis = null;
        this.initializeRedis();
    }

    async initializeRedis() {
        this.redis = await RedisConfig.getConnection();
    }

    // clear redis 
    async clear() {
        this.redis.flushAll();
        // this.redis.disconnect()
    }

    // string 
    async setString(key, value, ttl = null) {
        const jsonValue = JSON.stringify(value);
        if (ttl) {
            await this.redis.setEx(key, ttl, jsonValue);
        } else {
            await this.redis.set(key, jsonValue);
        }
    }

    async getString(key) {
        const value = await this.redis.get(key);
        return JSON.parse(value);
    }

    async delString(key) {
        return this.redis.getDel(key);
    }

    // bit map
    async setBitMap(key, offset, value = 1) {
        await this.redis.setBit(key, offset, value);
    }

    async getBitMap(key, offset) {
        return await this.redis.getBit(key, offset);
    }

    // hash
    /**
     * 
     * @param { second } ttl 
     */
    async setHash(key, fieldName, fieldValue, ttl = null) {
        await this.redis.hSet(key, String(fieldName), JSON.parse(fieldValue));
        if(ttl) {
            /****phiên bản redis server của máy mình đang chưa hỗ trợ */
            // await this.redis.hSetEx(key, {
            //     fieldName: fieldValue
            // }, {
            //     expiration: {
            //         type: 'EX', // đơn vị second 
            //         value: ttl
            //     },
            //     mode: 'FNX' // set value chỉ khi chưa tồn tại 
            // })
            await this.setExpireHash(key, fieldName, ttl)
        } 
        return;
    }

    async setHashNX(key, fieldName, fieldValue, ttl = null) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        const res = await this.redis.hSetNX(key, String(fieldName), String(fieldValue)); // set if not exists
        console.log(res)
        if(ttl && res) {
            /****phiên bản redis server của máy mình đang chưa hỗ trợ */
            // await this.redis.hSetEx(key, {
            //     fieldName: fieldValue
            // }, {
            //     expiration: {
            //         type: 'EX', // đơn vị second 
            //         value: ttl
            //     },
            //     mode: 'FNX' // set value chỉ khi chưa tồn tại 
            // })
            await this.setExpireHash(key, String(fieldName), ttl)
        } 
        return res;
    }

    async setExpireHash(key, fieldName, ttl) {
        return await this.redis.hExpire(key, String(fieldName), ttl, "NX");
    }
    async getHashByFieldName(key, fieldName) {
        return await this.redis.hGet(key, String(fieldName))
        // return JSON.parse(res)
    }

    async delFieldInHashByFieldName(key, fieldName) {
        return await this.redis.hDel(key, String(fieldName));
    }

    async delHash(key) {
        return await this.redis.del(key);
    }

    async getAllHast(key) {
        return await this.redis.hGetAll(key);
    }
    // pipe line
    async handlePipeline (cmds = []) {
        const pipeline = this.redis.pipeline()
    }

}

module.exports.redisService = new RedisService;
