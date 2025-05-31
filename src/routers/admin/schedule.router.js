'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { scheduleController } = require('../../controllers/admin/schedule.controller');
const router = express.Router();


router.get('/', asyncHandler(scheduleController.getAllSchedules));
router.get('/:scheduleId', asyncHandler(scheduleController.getOneScheduleByScheduleId));
router.post('/create', asyncHandler(scheduleController.createSchedule));
router.post('/create/list', asyncHandler(scheduleController.createListSchedules));
router.patch('/edit/:scheduleId', asyncHandler(scheduleController.editScheduleByScheduleId));


module.exports = router;