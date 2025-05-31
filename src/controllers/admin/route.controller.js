'use strict';

const { NotFoundError, BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { routeService } = require("../../services/database/route.service");

const getAllRoutes = async (req, res, next) => {
    const routes = await routeService.getAllRoutes(req.query);
    if(routes.length == 0) {
        return new NotFoundError('err::: not found routes').send(res);
    }

    const metadata = {
        routes
    };

    return new OK({metadata}).send(res);
}

const getOneRouteByRouteId = async (req, res, next) => {
    const { routeId } = req.params;
    if(!routeId) {
        return new BadRequestError('Err:::: not contain routeId').send(res);
    }

    const route = await routeService.getOneRouteByRouteId(routeId);
    if(!route) {
        return new NotFoundError('err::: not found route').send(res);
    }

    const metadata = {
        route
    };

    return new OK({metadata}).send(res);
}

const createRoute = async (req, res, next) => {
    const payload = req.body;
    // validation

    const result = await routeService.createRoute(payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

const createListRoutes = async (req, res, next) => {
    
    await routeService.createListRoutes();

    return new OK({}).send(res);
}


const editRouteByRouteId = async (req, res, next) => {
    const { routeId } = req.params;
    const payload = req.body;
    if(!routeId || !payload) {
        return new BadRequestError('Err:::: not contain routeId or payload').send(res);
    }

    const result = await routeService.editRouteByRouteId(routeId, payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

module.exports.routeController = {
    editRouteByRouteId, getAllRoutes, getOneRouteByRouteId, createRoute, createListRoutes
}