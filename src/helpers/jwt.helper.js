'use strict'

const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('node:crypto');
const { jwtConst } = require('../consts/jwt.const');

// const generateKeyPairForToken = async () => {
//     const { publicKey, privateKey } = generateKeyPairSync('rsa', {
//         modulusLength: 1024,
//         publicKeyEncoding: {
//             type: 'spki',
//             format: 'pem',
//         },
//         privateKeyEncoding: {
//             type: 'pkcs8',
//             format: 'pem',
//         },
//     });

//     return { publicKey, privateKey };
// }

let cachedKeys = null;

const generateKeyPairForToken = async () => {
    if (cachedKeys) {
        return cachedKeys; // Tái sử dụng cặp khóa
    }
    cachedKeys = generateKeyPairSync('rsa', {
        modulusLength: 2048, // Giữ nguyên 2048 để tuân thủ RS256
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    console.log(cachedKeys)
    return {...cachedKeys};
};

const verifyToken = ( token, publicKey ) => {
    return jwt.verify(token, publicKey);
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: jwtConst.AT_TTL_STRING
        });

        // refresh token
        const refreshToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: jwtConst.RT_TTL_STRING
        });

        // test verify
        verifyToken( accessToken, publicKey )

        return { accessToken, refreshToken };
    } catch (error) {
        throw Error(`Error verifying::: ${error.message}`);
    }
}


module.exports = {
    generateKeyPairForToken,
    createTokenPair,
    verifyToken
};
