const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const stationSchema = DatabaseConfig.sequelize_train_system.define("Station", {
    station_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    station_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    location: {
        type: DataTypes.ENUM('sourth', 'north'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "stations",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports.stationModel = stationSchema;