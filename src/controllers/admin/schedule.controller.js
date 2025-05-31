'use strict';

const { NotFoundError, BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { scheduleService } = require("../../services/database/schedule.service");

const getAllSchedules = async (req, res, next) => {
    const schedules = await scheduleService.getAllSchedules(req.query);
    if(schedules.length == 0) {
        return new NotFoundError('err::: not found schedules').send(res);
    }

    const metadata = {
        schedules
    };

    return new OK({metadata}).send(res);
}

const getOneScheduleByScheduleId = async (req, res, next) => {
    const { scheduleId } = req.params;
    if(!scheduleId) {
        return new BadRequestError('Err:::: not contain scheduleId').send(res);
    }

    const schedule = await scheduleService.getOneScheduleByScheduleId(scheduleId);
    if(!schedule) {
        return new NotFoundError('err::: not found schedule').send(res);
    }

    const metadata = {
        schedule
    };

    return new OK({metadata}).send(res);
}

const createSchedule = async (req, res, next) => {
    const payload = req.body;
    // validation

    const result = await scheduleService.createSchedule(payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

const createListSchedules = async (req, res, next) => {
    
    await scheduleService.createListSchedules();

    return new OK({}).send(res);
}


const editScheduleByScheduleId = async (req, res, next) => {
    const { scheduleId } = req.params;
    const payload = req.body;
    if(!scheduleId || !payload) {
        return new BadRequestError('Err:::: not contain scheduleId or payload').send(res);
    }

    const result = await scheduleService.editScheduleByScheduleId(scheduleId, payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

module.exports.scheduleController = {
    editScheduleByScheduleId, getAllSchedules, getOneScheduleByScheduleId, createSchedule, createListSchedules
}