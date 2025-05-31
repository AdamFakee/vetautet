'use strict';

const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode');

class SuccessResponse {
    constructor({ message, status = StatusCodes.OK, reasonStatus = ReasonPhrases.OK, metadata = {} }) {
        this.message = !message ? reasonStatus : message;
        this.status = status;
        this.metadata = metadata;
    }

    send (res) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata});
    }
}

class CREATED extends SuccessResponse {
    constructor ({ message, status = StatusCodes.CREATED, reasonStatus = ReasonPhrases.CREATED, metadata }) {
        super({ message, status, reasonStatus, metadata});
    }
}

class NoContent extends SuccessResponse {
    constructor({ message = ReasonPhrases.NO_CONTENT, status = StatusCodes.NO_CONTENT }) {
        super({ message, status });
    }
}


module.exports = {
    OK, CREATED, SuccessResponse, NoContent
}

