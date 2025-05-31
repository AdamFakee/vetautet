'use strict';
const data = require('../../data/stations.json');
const { stationModel } = require('../../models/train_system/station.model');

const getAllStations = async (opts = {}) => {
    const { limit = 10, page = 1 } = opts;
    const offset = (page - 1) * limit;
    return await stationModel.findAll({
        where: {
            status: 'active',            
        }, 
        limit: Number(limit),
        offset: Number(offset),
        raw: true,
    })
}

const getOneStationByStationId = async (station_id) => {
    return await stationModel.findOne({
        where: {
            station_id,
            status: 'active'
        }, 
        raw: true,
    })
}

const createStation = async (payload) => {
    return await stationModel.create(payload);
}

// tạo 1 list data để test 
const createListStaion = async () => {
    const amount = data.length;

    const promises = [];
    for(let i = 0; i < amount; i++) {
        promises.push(createStation(data[i]))
    }


    return await Promise.all(promises); 
}

const editStationByStationId = async (station_id, payload) => {
    return await stationModel.update(payload, {
        where: { 
            station_id,
        },
        raw: true
    });
}

module.exports.stationService = {
    createStation, editStationByStationId, getAllStations, getOneStationByStationId, createListStaion
}