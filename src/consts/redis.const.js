
const hash = {
    TICKET_PENDING: 'ticket_pending',
    TICKET_PENDING_TTL: 600, // 10 munites
    USER_HOLDING_TICKET: 'user_holding_ticket',
    TICKET_SOLD: 'ticket_sold',
    TICKET_SOLD_TTL: 3600 * 24,
}

const string = {
    TTL: 100 
}

module.exports.redisConst = {
    hash, string
}