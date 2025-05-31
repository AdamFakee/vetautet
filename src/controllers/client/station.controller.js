'use strict';

const { NotFoundError, BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { stationService } = require("../../services/database/station.service");

const getAllStations = async (req, res, next) => {
    const stations = await stationService.getAllStations(req.query);
    if(stations.length == 0) {
        return new NotFoundError('err::: not found stations').send(res);
    }

    const metadata = {
        stations
    };

    return new OK({metadata}).send(res);
}


module.exports.stationClientController = {
    getAllStations
}