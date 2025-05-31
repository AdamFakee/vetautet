'use strict'

const { HEADER } = require("../../consts/header.const");
const { jwtConst } = require("../../consts/jwt.const");
const { AuthFailureError, NotFoundError } = require("../../core/error.response");
const asyncHandler = require("../../helpers/asyncHandler.helper");
const { verifyToken } = require("../../helpers/jwt.helper");
const { keyTokenService } = require("../../services/database/keyToken.service");
const { userService } = require("../../services/database/user.service");
const { redisService } = require("../../services/others/redis.service");

const authentication = asyncHandler ( async ( req, res, next ) => {
    /*
        1. check userId missing?
        2. check accessToken
        3. check user in dbs
        4. check keyStore with this userId
        5. ok all => return next
    */
    const userId = req.headers[HEADER.USER_ID];
    if(!userId) {
        throw new AuthFailureError('Error::: userId missing')
    }

    // let keyToken = await redisService.getString(userId);
    // if(!keyToken) {
    //     keyToken = await keyTokenService.getOneKeyTokenByUserId(userId);
    // }

    // if(!keyToken) {
    //     throw new NotFoundError('Error::: key token is not exists')
    // } 

    // await redisService.setString(userId, keyToken, jwtConst.AT_TTL_SECONDS)

    // chứa refreshToken => trường hợp token hết hạn
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    if(refreshToken) {
        try {
            const decoded = verifyToken(refreshToken, process.env.PUBLIC_KEY);
            if(decoded.email !== userEmail) {
                throw new AuthFailureError('Error::: invalid token')
            }
            req.user = decoded;
            req.refreshToken = refreshToken;
            req.keyToken = keyToken;
            return next();
        } catch (error) {
            throw error
        }
    }

    // trường hợp client gửi req bình thường 
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) {
        throw new AuthFailureError('Error::: accessToken missing')
    }

    try {
        const decoded = verifyToken(accessToken, process.env.PUBLIC_KEY);
        console.log(decoded, userId)
        if(decoded.user_id != userId) {
            throw new AuthFailureError('Error::: invalid token')
        }
        req.user = decoded;
        return next();
    } catch (error) {
        throw error
    }
})

module.exports = {
    authentication
}