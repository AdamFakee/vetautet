'use strict'
const Sequelize = require('sequelize');
require('dotenv').config();
 


class Database {
    static sequelize_train_system_user;
    static sequelize_train_system_north_to_sourth;
    static sequelize_train_system_sourth_to_north;
    static sequelize_train_system;


    static test () {
        const sequelize = new Sequelize(
            'train_system_user', // tên database
            'adam', // username
            process.env.DATABASE_PASSWORD, // password
            {
                host: 3308,
                dialect: 'mysql',
                port: 3308,
                pool: {
                    max: 30,        // ✅ Giảm từ 50 → 30 (vì có 4 DB)
                    min: 2,         // ✅ Giảm từ 10 → 2 
                    acquire: 60000, // ✅ Tăng từ 30s → 60s
                    idle: 10000,    // ✅ Tăng từ 5s → 10s
                    evict: 1000,    // ✅ Thêm evict interval
                },
                benchmark: true,
                logging: false, // ✅ Tắt logging trong production
                
                // ✅ Thêm retry logic
                // retry: {
                //     max: 3,
                //     match: [
                //         Sequelize.ConnectionError,
                //         Sequelize.ConnectionTimedOutError,
                //         Sequelize.TimeoutError,
                //     ],
                // },
                
                // // ✅ Thêm connection options
                // dialectOptions: {
                //     connectTimeout: 30000,     // 30s connection timeout
                //     acquireTimeout: 60000,     // 60s acquire timeout  
                //     timeout: 60000,            // 60s query timeout
                //     reconnect: true,
                //     // ✅ Tối ưu MySQL settings
                //     supportBigNumbers: true,
                //     bigNumberStrings: true,
                //     multipleStatements: false,
                //     flags: ['-FOUND_ROWS']
                // },
                
                // // ✅ Query optimization
                // define: {
                //     charset: 'utf8mb4',
                //     collate: 'utf8mb4_unicode_ci',
                //     timestamps: true,
                //     freezeTableName: true,     // Không pluralize table names
                //     underscored: false,        // camelCase thay vì snake_case
                // }
            },
        );
        return this.Connect(sequelize, 'usersssssss');
    }
    static Initial () {
        this.sequelize_train_system = this.CreateConnect('train_system');
        this.sequelize_train_system_north_to_sourth = this.CreateConnect('train_system_north_to_south');
        this.sequelize_train_system_sourth_to_north = this.CreateConnect('train_system_south_to_north');
        this.sequelize_train_system_user = this.CreateConnect('train_system_user')
        this.test()
    }

    static CreateConnect (databaseName) {
        const sequelize = new Sequelize(
            databaseName, // tên database
            process.env.DATABASE_USER_NAME, // username
            process.env.DATABASE_PASSWORD, // password
            {
                host: process.env.DATABASE_HOST,
                dialect: 'mysql',
                port: 3306,
                pool: {
                    max: 30,        // ✅ Giảm từ 50 → 30 (vì có 4 DB)
                    min: 2,         // ✅ Giảm từ 10 → 2 
                    acquire: 60000, // ✅ Tăng từ 30s → 60s
                    idle: 10000,    // ✅ Tăng từ 5s → 10s
                    evict: 1000,    // ✅ Thêm evict interval
                },
                benchmark: true,
                logging: false, // ✅ Tắt logging trong production
                
                // ✅ Thêm retry logic
                // retry: {
                //     max: 3,
                //     match: [
                //         Sequelize.ConnectionError,
                //         Sequelize.ConnectionTimedOutError,
                //         Sequelize.TimeoutError,
                //     ],
                // },
                
                // // ✅ Thêm connection options
                // dialectOptions: {
                //     connectTimeout: 30000,     // 30s connection timeout
                //     acquireTimeout: 60000,     // 60s acquire timeout  
                //     timeout: 60000,            // 60s query timeout
                //     reconnect: true,
                //     // ✅ Tối ưu MySQL settings
                //     supportBigNumbers: true,
                //     bigNumberStrings: true,
                //     multipleStatements: false,
                //     flags: ['-FOUND_ROWS']
                // },
                
                // // ✅ Query optimization
                // define: {
                //     charset: 'utf8mb4',
                //     collate: 'utf8mb4_unicode_ci',
                //     timestamps: true,
                //     freezeTableName: true,     // Không pluralize table names
                //     underscored: false,        // camelCase thay vì snake_case
                // }
            },
        );
        return this.Connect(sequelize, databaseName);
    }
    static Connect (sequelize, databaseName) {
        sequelize.authenticate().then(() => {
            console.log('Kết nối db thành công!' + ':::::' + databaseName);
        }).catch((error) => {
            console.error('Kết nối db thất bại: ' + ':::::' + databaseName, error);
        });
        return sequelize;
    }

    // static getInstance() {
    //     if(!this.Instance) {
    //         console.log('loerrr')
    //         this.Instance = new Database();
    //         return this.Instance;
    //     }
    //     return this.Instance
    // }
}

Database.Initial()
module.exports.DatabaseConfig = Database;