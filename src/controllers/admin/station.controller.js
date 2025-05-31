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

const getOneStationByStationId = async (req, res, next) => {
    const { stationId } = req.params;
    if(!stationId) {
        return new BadRequestError('Err:::: not contain stationId').send(res);
    }

    const station = await stationService.getOneStationByStationId(stationId);
    if(!station) {
        return new NotFoundError('err::: not found station').send(res);
    }

    const metadata = {
        station
    };

    return new OK({metadata}).send(res);
}

const createStation = async (req, res, next) => {
    const payload = req.body;
    // validation

    const result = await stationService.createStation(payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

const createListStation = async (req, res, next) => {
    
    await stationService.createListStaion();

    return new OK({}).send(res);
}


const editStationByStationId = async (req, res, next) => {
    const { stationId } = req.params;
    const payload = req.body;
    if(!stationId || !payload) {
        return new BadRequestError('Err:::: not contain stationId or payload').send(res);
    }

    const result = await stationService.editStationByStationId(stationId, payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

module.exports.stationController = {
    editStationByStationId, getAllStations, getOneStationByStationId, createStation, createListStation
}