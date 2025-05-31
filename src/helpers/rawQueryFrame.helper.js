'use strict'

const { QueryTypes } = require("sequelize");
const { DatabaseConfig } = require("../configs/database.config");
// const { sequelize } = require("../configs/database.config")

// pass query string in database
const rawQueryFrameHelper = async (query) => {
    console.log('ok')
    return await DatabaseConfig.sequelize_train_system.query(
        query,
        {
            type : QueryTypes.SELECT
        }
    )
}

module.exports.rawQueryFrameHelper = rawQueryFrameHelper;