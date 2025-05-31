'use strict';
const data = require('../../data/schedule.json');
const { rawQueryFrameHelper } = require("../../helpers/rawQueryFrame.helper");
const { scheduleModel } = require('../../models/train_system/schedule.model');

const getAllSchedules = async (opts = {}) => {
    const { limit, page } = opts;
    const offset = (page - 1) * limit;

    const query = `
        SELECT * 
        FROM schedules
        JOIN routes ON routes.route_id = schedules.route_id
        WHERE schedules.status = 'active' 
        LIMIT ${limit} OFFSET ${offset}
    `;

    return await rawQueryFrameHelper(query);
};


const getAllSchedulesJoinTrainsTable = async () => {
    const query = `
        select trains.train_id, trains.train_name, trains.total_seats, schedules.schedule_id 
        from trains
        join schedules on trains.train_id = schedules.train_id
    `
    return await rawQueryFrameHelper(query);
}

const getOneScheduleByScheduleId = async (schedule_id) => {
    return await scheduleModel.findAll({
        where: {
            schedule_id,
            status: 'active'
        }, 
        raw: true,
    })
}

const createSchedule = async (payload) => {
    return await scheduleModel.create(payload);
}

// tạo 1 list data để test 
const createListSchedules = async () => {
    const amount = data.length;

    const promises = [];
    for(let i = 0; i < amount; i++) {
        promises.push(createSchedule(data[i]))
    }


    return await Promise.all(promises); 
}

const editScheduleByScheduleId = async (schedule_id, payload) => {
    return await scheduleModel.update(payload, {
        where: { 
            schedule_id,
        },
        raw: true
    });
}

module.exports.scheduleService = {
    editScheduleByScheduleId, createSchedule, getAllSchedules, getOneScheduleByScheduleId, createListSchedules, getAllSchedulesJoinTrainsTable
}