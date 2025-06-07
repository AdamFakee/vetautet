'use strict'

require('dotenv').config();
const express = require('express');
const cors = require("cors");
const { DatabaseConfig } = require('./configs/database.config.js'); 
const { TicketConsumer } = require('./services/others/kafka/consumer.kafka.service.js');
const os = require('os');
const { QueryTypes } = require("sequelize");

// // Lấy thông tin chi tiết về từng core
// const cpus = os.cpus();

// console.log(`Số lượng core CPU: ${cpus.length}`);
// console.log('Chi tiết CPU:', cpus);
const app = express();

app.use(cors());


// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended : true
}));

// init comsumer 
const ticketConsumer = new TicketConsumer();
ticketConsumer.start().catch(console.error);

// init db
// console.log('xx',DatabaseConfig)
new DatabaseConfig().testConnections();

// init routes
app.use('/', require('./routers/client/index.router.js'));
app.use('/admin', require('./routers/admin/index.router.js'));

// handle errors
app.use((req, res, next) => {
    // Nếu không tìm được router thì chạy xuống đây => gán 404
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode, 
        message: error.message || 'Internal Server Error',
        stack: error.stack,
    })
})


module.exports = app;
