const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const scheduleSchema = new DatabaseConfig().getMasterDb().define("Schedule", {
    schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    train_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trains',
            key: 'train_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    route_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'routes',
            key: 'route_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
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
    tableName: "schedules",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports.scheduleModel = scheduleSchema;