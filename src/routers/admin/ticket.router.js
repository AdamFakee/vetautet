'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { ticketController } = require('../../controllers/admin/ticket.controller');
const router = express.Router();


router.get('/schedule/:scheduleId', asyncHandler(ticketController.getAllTicketsByScheduleId));
router.get('/:ticketId', asyncHandler(ticketController.getOneTicketByTicketId));
router.post('/create', asyncHandler(ticketController.createTicket));
router.post('/create/list', asyncHandler(ticketController.createListTickets));
router.patch('/edit/:ticketId', asyncHandler(ticketController.editTicketByTicketId));


module.exports = router;