const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const ticketPurchaseSchema = new DatabaseConfig().getMasterDb().define("TicketPurchase", {
    purchase_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tickets',
            key: 'ticket_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    purchase_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    tableName: "ticket_purchases",
    timestamps: true,
    createdAt: 'purchase_time',
    updatedAt: false,
});


module.exports.ticketPurchaseModel = ticketPurchaseSchema;