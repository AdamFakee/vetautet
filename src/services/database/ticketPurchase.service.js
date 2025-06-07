'use strict';

const { ticketPurchaseModel_slave } = require("../../models/train_system_distributed/ticketPurchase.model");
const { QueryTypes } = require("sequelize");



const createTicketPurchase = async (payload, opts={}) => {    
    const {
        user_id,
        ticket_id,
        status = 'active'
    } = payload;
    
    try {
        const result = await ticketPurchaseModel_slave.sequelize.query(
            `DECLARE @InsertedRows TABLE (id UNIQUEIDENTIFIER);
             INSERT INTO ticket_purchases 
             (id, user_id, ticket_id, purchase_time, status)
             OUTPUT inserted.id INTO @InsertedRows
             VALUES (NEWID(), ?, ?, GETDATE(), ?);
             SELECT id FROM @InsertedRows;`,
            {
                replacements: [
                    user_id,
                    ticket_id,
                    status
                ],
                type: QueryTypes.SELECT,
            }
        );
        return;
    } catch (error) {
        console.error('Lỗi khi thêm ticket purchase vào SlaveDB:', error);
        return;
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