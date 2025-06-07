'use strict';
const { groupHelper } = require("../../helpers/group.helper");
const { randomHelper } = require("../../helpers/random.helper");
const { rawQueryFrameHelper } = require("../../helpers/rawQueryFrame.helper");
const { ticketModel } = require("../../models/train_system/ticket.model");
const { scheduleService } = require("./schedule.service");

const getAllTicketsByScheduleId = async (schedule_id) => {
    const query = `
        select 
            tickets.price, tickets.seat_number, tickets.ticket_id, schedules.departure_time, schedules.arrival_time, trains.train_name, s1.station_name as departure_station, s1.address as departure_address, s2.station_name as arrival_station, s2.address as arrival_address, r.direction
        from 
            schedules
        join tickets on schedules.schedule_id = tickets.schedule_id
        join trains on trains.train_id = schedules.train_id
        join routes r on r.route_id = schedules.route_id
        JOIN stations s1 ON r.departure_station_id = s1.station_id
        JOIN stations s2 ON r.arrival_station_id = s2.station_id 
        where 
            schedules.schedule_id = ${Number(schedule_id)}
    `
    return await rawQueryFrameHelper(query)
}

const getOneTicketByTicketId = async (ticket_id, direction, opts={}) => {
    return await ticketModel.findOne({
        where: {
            ticket_id,
            ...opts
        }, 
        raw: true,
    })
}

const createOneTicket = async (payload) => {
    // payload.direction = payload.direction || 'north_to_south';
    return await ticketModel.create(payload);
}

const createListTicketsByAmount = async (amount, payload) => {
    const promises = [];

    for (let i = 1; i <= amount; i++) {
        const ticketPayload = { ...payload, seatNumber: i }; // số thứ tự ghế ngồi của vé 
        promises.push(createOneTicket(ticketPayload));
    }

    await Promise.all(promises); 
    return;
}

// tạo data để test 
const createListTickets = async () => {
    const cnt = 1;
    const results = await scheduleService.getAllSchedulesJoinTrainsTable();
    if(results.length === 0) {
        throw new Error('Err::: not found schedules');
    }
    const promises = [];
    for(let i = 0; i < results.length; i++) {
        const el = results[i];
        const totalOfSeat = el.total_seats;
        const ticket = {
            schedule_id: el.schedule_id,
            price: randomHelper.randomNumber()
        }
        for(let j = 1; j <= totalOfSeat; j++) {
            const seatNumber = groupHelper.seatNumberContributor(j) + `-${j}`;
            ticket.seat_number = seatNumber;
            promises.push(createOneTicket(ticket));
        }
    }

    return await Promise.all(promises)
}

const editOneTicketByTicketId = async (ticket_id, direction, payload, opts = {}) => {
    return await ticketModel.update(payload, {
        where: { 
            ticket_id,
        },
        raw: true,
        ...opts
    });
}

module.exports.ticketService = {
    editOneTicketByTicketId, createOneTicket, createListTicketsByAmount, getAllTicketsByScheduleId, getOneTicketByTicketId, createListTickets
}