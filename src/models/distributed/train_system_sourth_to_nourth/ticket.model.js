const { DatabaseConfig } = require('../../../configs/database.config');
const { DataTypes } = require('sequelize');

const ticketSchema = DatabaseConfig.sequelize_train_system_sourth_to_north.define("Ticket", {
    ticket_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'schedule_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    seat_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('available', 'pending', 'booked', 'cancelled'),
        defaultValue: 'available',
    },
    pending_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    shard_key: {
        type: DataTypes.STRING(10),
        defaultValue: 'north_to_south'
    }
}, {
    tableName: "tickets",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});


module.exports.ticketModel_sourth_to_north = ticketSchema;