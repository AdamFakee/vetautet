'use strict';
const data = require('../../data/routes.json');
const { rawQueryFrameHelper } = require("../../helpers/rawQueryFrame.helper");
const { routeModel } = require('../../models/train_system/route.model');

const getAllRoutes = async (opts = {}) => {
    const { limit = 10, page = 1 } = opts;
    const offset = (page - 1) * limit;
    return await routeModel.findAll({
        where: {
            status: 'active'
        }, 
        limit: Number(limit),
        offset: Number(offset),
        raw: true,
    })
}

const getOneRouteByRouteId = async (route_id) => {
    return await routeModel.findAll({
        where: {
            route_id,
            status: 'active'
        }, 
        raw: true,
    })
}

const detailRouteByRouteId = async (route_id) => {
    const query = `
        SELECT 
            routes.distance_km, stations.station_name, stations.address, routes.departure_station_id, routes.arrival_station_id, stations.station_id
        FROM routes
        JOIN stations ON stations.station_id = routes.departure_station_id OR stations.station_id = routes.arrival_station_id
        WHERE routes.route_id = ${Number(route_id)} AND routes.status = 'active';
    `
    const result = await rawQueryFrameHelper(query);

    let departureStation = null;
    let arrivalStation = null;
    
    result.forEach(el => {
        if(el.departure_station_id === el.station_id) {
            departureStation = {
                station_id: el.station_id,
                station_name: el.station_name,
                address: el.address
            };
        }
        else {
            arrivalStation =  {
                station_id: el.station_id,
                station_name: el.station_name,
                address: el.address
            };
        }
    });
    return {
        departureStation, 
        arrivalStation,
        distance_km: result[0].distance_km
    }
}

const createRoute = async (payload) => {
    return await routeModel.create(payload);
}

// tạo 1 list data để test 
const createListRoutes = async () => {
    const amount = data.length;

    const promises = [];
    for(let i = 0; i < amount; i++) {
        console.log(data[i])
        promises.push(createRoute(data[i]))
    }


    return await Promise.all(promises); 
}

const editRouteByRouteId = async (route_id, payload) => {
    return await routeModel.update(payload, {
        where: { 
            route_id,
        },
        raw: true
    });
}

const searchByStationIds = async (from, to) => {
    const query = `
        SELECT 
            s1.station_name AS departure_station,
            s2.station_name AS arrival_station,
            t.train_name,
            t.train_id,
            s.schedule_id,
            t.total_seats,
            s.departure_time,
            s.arrival_time,
            s1.address AS departure_address,
            s2.address AS arrival_address,
            r.arrival_station_id, r.departure_station_id
        FROM 
            schedules s
            JOIN trains t ON s.train_id = t.train_id
            JOIN routes r ON s.route_id = r.route_id
            JOIN stations s1 ON r.departure_station_id = s1.station_id
            JOIN stations s2 ON r.arrival_station_id = s2.station_id
        WHERE 
            r.departure_station_id = ${Number(from)}
            AND r.arrival_station_id = ${Number(to)}
            AND s.status = 'active'
            AND t.status = 'active'
            AND r.status = 'active'
            AND s1.status = 'active'
            AND s2.status = 'active';
    `
    return await rawQueryFrameHelper(query);
}  

module.exports.routeService = {
    editRouteByRouteId, createRoute, getAllRoutes, getOneRouteByRouteId, createListRoutes, searchByStationIds, detailRouteByRouteId
}