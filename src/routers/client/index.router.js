'use strict'

const express = require('express');
const router = express.Router();

router.use('/user', require('./user.router'))
router.use('/station', require('./station.router'))
router.use('/route', require('./route.router'))
router.use('/ticket', require('./ticket.router'))
router.use('/otherAction', require('./otherAction.router'))
router.use('/schedule', require('./schedule.router'))


module.exports = router;