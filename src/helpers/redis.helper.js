
const createTicketFieldName = (ticketId, userId) => {
    return 'ticketId::' + ticketId + "::userId::" + userId;
}


module.exports.redisHelper = {
    createTicketFieldName
}