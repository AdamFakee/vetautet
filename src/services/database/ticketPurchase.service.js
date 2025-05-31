'use strict';


const { ticketPurchaseModel_north_to_sourth } = require("../../models/distributed/train_system_north_to_sourth/ticketPurchase.model");
const { ticketPurchaseModel_sourth_to_north } = require("../../models/distributed/train_system_sourth_to_nourth/ticketPurchase.model");

const createTicketPurchase = async (payload, opts={}) => {    
    const { direction } = payload;
    console.log(payload)
    if(direction == 'south_to_north') {
        return await ticketPurchaseModel_sourth_to_north.create(payload);
    } else {
        return await ticketPurchaseModel_north_to_sourth.create(payload);
    }
}

const deleteInactiveTicket  = async (purchase_id, ticket_id, user_id) => {
    return await scheduleModel.update({
        status: 'inactive'
    }, {
        where: { 
            purchase_id,
            ticket_id,
            user_id,
        },
        raw: true
    });
}

module.exports.ticketPurchaseService = {
    deleteInactiveTicket, createTicketPurchase,
}