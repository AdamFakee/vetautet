'use strict'

const { userModel_user } = require("../../models/distributed/train_system_user/user.model");


// create new user 
const createNewUser = async (data) => {
    const newUser = await userModel_user.create(data);
    return newUser.get({ plain: true }); // Lấy dữ liệu thô
};


const getUserByUsername = async ( username ) => {
    return await userModel_user.findOne({
        where: {
            username,
            status: 'active'
        },
        raw: true
    });
}

const getUserByUserId = async ( user_id ) => {
    return await userModel_user.findOne({
        where: {
            user_id,
            status: 'active'
        },
        raw: true
    });
}

const updateUserByUserId = async ( userId, payload ) => {
    return await userModel_user.update(payload, {
        where: { 
            user_id: userId, status: 'active'
        },
        raw: true
    });
}

module.exports.userService = {
    createNewUser, getUserByUsername, updateUserByUserId, getUserByUserId
}