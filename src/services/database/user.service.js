'use strict'

const { DatabaseConfig } = require("../../configs/database.config");
const { userModel_slave } = require("../../models/train_system_distributed/user.model");
const { QueryTypes } = require("sequelize");


// create new user 
const createNewUser = async (data) => {
    const {
        username,
        password_hash,
        full_name,
        email,
        phone = null,
        status = 'active'
    } = data;

    try {
        const result = await userModel_slave.sequelize.query(
          `DECLARE @InsertedRows TABLE (user_id INT);
             INSERT INTO users 
             (username, password_hash, full_name, email, phone, status, created_at)
             OUTPUT inserted.user_id INTO @InsertedRows
             VALUES (?, ?, ?, ?, ?, ?, GETDATE());
             SELECT user_id FROM @InsertedRows;`,
          {
            replacements: [
              username,
              password_hash,
              full_name,
              email,
              phone,
              status,
            ],
            type: QueryTypes.SELECT,
          }
        );

        return result[0];
    } catch (error) {
        console.error('Lỗi khi thêm user vào SlaveDB:', error);
        return;
    }
};


const getUserByUsername = async ( username ) => {
    return await userModel_slave.findOne({
        where: {
            username,
            status: 'active'
        },
        raw: true
    });
}

const getUserByUserId = async ( user_id ) => {
    return await userModel_slave.findOne({
        where: {
            user_id,
            status: 'active'
        },
        raw: true
    });
}

const updateUserByUserId = async ( userId, payload ) => {
    return await userModel_slave.update(payload, {
        where: { 
            user_id: userId, status: 'active'
        },
        raw: true
    });
}

module.exports.userService = {
    createNewUser, getUserByUsername, updateUserByUserId, getUserByUserId
}