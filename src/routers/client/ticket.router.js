'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { ticketClientController } = require('../../controllers/client/ticket.controller');
const { authentication } = require('../../middlewares/client/authentication.middleware');

const router = express.Router();


router.get('/schedule/:scheduleId', asyncHandler(ticketClientController.getAllTicketsByScheduleId));
router.get('/:direction/:ticketId', asyncHandler(ticketClientController.getOneTicketByTicketId));


//---middleware authetication
router.use(authentication);



router.post('/holding/:direction/:ticketId', asyncHandler(ticketClientController.hodlingTicketForPayment))
router.post('/cancel/:ticketId', asyncHandler(ticketClientController.cancelHoldingTicket))
router.post('/payment/:ticketId', asyncHandler(ticketClientController.payment))
module.exports = router;