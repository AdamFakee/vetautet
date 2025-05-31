'use strict'

const brcypt = require('bcrypt');

const hashPassword = async ( password ) => {
    return await brcypt.hash( password, 8 );
}

const comparePassword = async ( passwordInDb, passwordFromUser ) => {
    return brcypt.compare( passwordFromUser, passwordInDb );
}

module.exports = {
    hashPassword, comparePassword
}