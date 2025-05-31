const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const ticketRefundSchema = DatabaseConfig.sequelize_train_system.define("TicketRefund", {
    refund_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    purchase_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ticket_purchases',
            key: 'purchase_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    refund_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    tableName: "ticket_refunds",
    timestamps: true,
    createdAt: 'refund_time',
    updatedAt: false,
});


module.exports.ticketRefundModel = ticketRefundSchema;