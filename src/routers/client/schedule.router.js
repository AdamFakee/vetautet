'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { scheduleClientController } = require('../../controllers/client/schedule.controller');
const router = express.Router();


router.get('/', asyncHandler(scheduleClientController.getAllSchedule));

module.exports = router;