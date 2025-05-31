'use strict'

const express = require('express');
const router = express.Router();

router.use('/station', require('./station.router'));
router.use('/train', require('./train.router'));
router.use('/route', require('./route.router'));
router.use('/schedule', require('./schedule.router'));
router.use('/ticket', require('./ticket.router'));

module.exports = router;