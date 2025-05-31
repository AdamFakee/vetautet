'use strict'

const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../../core/error.response");
const { CREATED, OK } = require("../../core/success.response");
const { comparePassword, hashPassword } = require("../../helpers/bcrypt.helper");
const { hashEmailToInt } = require("../../helpers/hash.helper");
const { generateKeyPairForToken, createTokenPair } = require('../../helpers/jwt.helper');
const { keyTokenService } = require("../../services/database/keyToken.service");
const { userService } = require("../../services/database/user.service");
const { getInfoData } = require("../../utils/object.util");
const { redisService } = require('../../services/others/redis.service');
// signup 
const signup = async ( req, res ) => {
    // skip validation
    const { email, password } = req.body;
    console.log(req.body)
    const key = 'signup:user';
    // const offset = hashEmailToInt(email);
    // // check from redis 
    // const existUser = await redisService.getBitMap(key, offset)
    // if( existUser ) throw new ConflictRequestError('Error::: user existed');

    const hashPass = await hashPassword( password );
    if( !hashPass ) throw new AuthFailureError('Error::: hash password fails');

    const newUser = await userService.createNewUser({
        ...req.body,
        password_hash: hashPass
    });
    if( !newUser ) throw new BadRequestError('Error::: created fail');

    // create key and token
    const payload = { user_id: newUser.user_id };
    const { accessToken, refreshToken } = await createTokenPair( payload, process.env.PUBLIC_KEY, process.env.PRIVATE_KEY );
    if( !accessToken || !refreshToken ) throw new BadRequestError('Error::: create new pair tokens fail') ;

    // set redis 
    // await redisService.setBitMap(key, offset);

    const fields = [ 'user_id', 'full_name', 'phone', 'email' ];
    const metadata = { 
        tokens: {
            accessToken, refreshToken
        }, 
        data: getInfoData({ fields, object: newUser })
    };
    const message = 'signup successfull';
    return new CREATED({ metadata, message }).send(res);
}

// login
const login = async ( req, res ) => {
    const { username, password } = req.body;
    console.log(req.body)
    const user = await userService.getUserByUsername( username );
    if( !user ) throw new BadRequestError('Error::: login fail');

    const matchPass = await comparePassword( user.password_hash, password );
    if( !matchPass ) throw new BadRequestError('Error::: comparePassword fail')
    
    // create new token and key
    const payload = { user_id: user.user_id };
    const { accessToken, refreshToken } = await createTokenPair( payload, process.env.PUBLIC_KEY, process.env.PRIVATE_KEY );
    if( !accessToken || !refreshToken ) throw new BadRequestError('Error::: create new pair tokens fail') ;

    // await keyTokenService.createOrUpdateKeyToken( user.user_id, { accessToken, refreshToken, privateKey, publicKey });

    const fields = [ 'user_id', 'full_name', 'phone', 'email' ];
    const metadata = { 
        tokens: {
            accessToken, refreshToken
        }, 
        data: getInfoData({ fields, object: user })
    };
    const message = 'login successfull';
    return new OK({ metadata, message }).send(res );
}

// logout 
const logout = async ( req, res ) => {
    const keyToken = req.keyToken;
    const delKey = await keyTokenService.removerKeyTokenByUserId(keyToken.user_id);

    if( !delKey ) {
        throw new Error('Error: logout fail')
    }

    const message = 'logout success'
    return new OK({ message }).send(res );
}

const getUserByUserId = async ( req, res ) => {
    const { user_id } = req.user;
    const user = await userService.getUserByUserId(user_id);
    delete user.password;
    const message = 'success';

    const metadata = {user};
    return new OK({ message, metadata }).send(res);
}



module.exports.userController = {
    login, signup, logout, getUserByUserId
}