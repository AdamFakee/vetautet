const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const keyTokenSchema = new DatabaseConfig().getSlaveDb().define("KeyToken", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    publicKey: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    privateKey: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    refreshTokenUsed: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    refreshToken: {
        type: DataTypes.TEXT,
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
    tableName: "keytokens",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});


module.exports.keyTokenModel_slave = keyTokenSchema;