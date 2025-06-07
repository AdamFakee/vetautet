'use strict'

const { QueryTypes } = require("sequelize");
const { DatabaseConfig } = require("../configs/database.config");
// const { sequelize } = require("../configs/database.config")

// pass query string in database
const rawQueryFrameHelper = async (query) => {
    const masterDb = new DatabaseConfig().getMasterDb();
    return await masterDb.query(
        query,
        {
            type : QueryTypes.SELECT
        }
    )
}

module.exports.rawQueryFrameHelper = rawQueryFrameHelper;