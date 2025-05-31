const { DatabaseConfig } = require('../../configs/database.config');
const { DataTypes } = require('sequelize');

const routeSchema = DatabaseConfig.sequelize_train_system.define("Route", {
    route_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    departure_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stations',
            key: 'station_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    arrival_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stations',
            key: 'station_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    distance_km: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    direction: {
        type: DataTypes.ENUM('south_to_north', 'north_to_south'),
        allowNull: false
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
    tableName: "routes",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});


module.exports.routeModel = routeSchema;