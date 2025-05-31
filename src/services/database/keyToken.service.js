'use strict'

const { keyTokenModel } = require("../../models/train_system/keyToken.model");

// get one field by userId, teacherId
const getOneKeyTokenByUserId = async ( user_id ) => {
    return await keyTokenModel.findOne({
        where: {
            user_id
        },
        raw: true
    });
}

// create new field
const createNewKeyToken = async ( user_id, data ) => {
    return await keyTokenModel.create({ user_id, ...data });
}

// create or update current field
const createOrUpdateKeyToken = async ( user_id, data ) => {
    return await keyTokenModel.upsert({ user_id, ...data});
}

// remove keytoken
const removerKeyTokenByUserId = async ( user_id ) => {
    return await keyTokenModel.destroy({
        where: {
            user_id
        }
    })
}
module.exports.keyTokenService = {
    getOneKeyTokenByUserId, createNewKeyToken, createOrUpdateKeyToken, removerKeyTokenByUserId
}