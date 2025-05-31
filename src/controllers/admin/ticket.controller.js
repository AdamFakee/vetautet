'use strict';

const { NotFoundError, BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { ticketService } = require("../../services/database/ticket.service");

const getAllTicketsByScheduleId = async (req, res, next) => {
    const { scheduleId } = req.params;
    if(!scheduleId) {
        return new BadRequestError('Errr:::: not contain scheduleId').send(res);
    }

    const tickets = await ticketService.getAllTicketsByScheduleId(scheduleId);
    if(tickets.length === 0) {
        return new NotFoundError('Err::: not found tickets').send(res);
    }

    const metadata = {
        tickets
    }

    return new OK({metadata}).send(res)
}

const getOneTicketByTicketId = async (req, res, next) => {
    const { ticketId } = req.params;
    if(!ticketId) {
        return new BadRequestError('Errr:::: not contain ticketId').send(res);
    }

    const ticket = await ticketService.getOneTicketByTicketId(ticketId);
    if(!ticket) {
        return new NotFoundError('Err::: not found ticket').send(res);
    }

    const metadata = {
        ticket
    }

    return new OK({metadata}).send(res)
}


const editTicketByTicketId = async (req, res, next) => {
    const { ticketId } = req.params;
    const payload = req.body;
    if(!ticketId || !payload) {
        return new BadRequestError('Err:::: not contain ticketId or payload').send(res);
    }

    const result = await ticketService.editOneTicketByTicketId(ticketId, payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

const createTicket = async (req, res, next) => {
    const result = await ticketService.createOneTicket(req.body);
    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

const createListTickets = async (req, res, next) => {
    const result = await ticketService.createListTickets();

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

module.exports.ticketController = {
    editTicketByTicketId, getAllTicketsByScheduleId, getOneTicketByTicketId, createListTickets ,createTicket
}