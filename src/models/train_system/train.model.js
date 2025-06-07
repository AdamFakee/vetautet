const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const trainSchema = new DatabaseConfig().getMasterDb().define("Train", {
    train_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    train_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    total_seats: {
        type: DataTypes.INTEGER,
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "trains",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});


module.exports.trainModel = trainSchema;