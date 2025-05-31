'use strict';

const { NotFoundError, BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { routeService } = require("../../services/database/route.service");
const { redisService } = require("../../services/others/redis.service");

const getAllRoutes = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const redisKeyForAllRoutes = 'ROUTE_ALL' + `::page=${page}::` + `limit=${limit}`;

    // find all routes in redis string
    let routes = await redisService.getString(redisKeyForAllRoutes);
    if(routes && routes.length > 0) {
        const metadata = {
            routes
        };

        return new OK({metadata}).send(res);
    }

    // query in db
    routes = await routeService.getAllRoutes({page, limit});
    if(routes.length == 0) {
        return new NotFoundError('err::: not found routes').send(res);
    }

    await redisService.setString(redisKeyForAllRoutes, routes, 10000); // 10k senconds

    const metadata = {
        routes
    };

    return new OK({metadata}).send(res);
}

const detailRouteByRouteId = async (req, res, next) => {
    const { routeId } = req.params;
    if(!routeId) {
        return new BadRequestError('Err:::: not contain routeId').send(res);
    }

    const redisKeyForDetailRoute = 'DETAIL_ROUTE'  + `::routeId=${routeId}`;
    // find all routes in redis string
    let route = await redisService.getString(redisKeyForDetailRoute);
    if(route) {
        const metadata = {
            route
        };

        return new OK({metadata}).send(res);
    }

    // find in db
    route = await routeService.detailRouteByRouteId(routeId);
    if(!route) {
        return new NotFoundError('err::: not found route').send(res);
    }

    await redisService.setString(redisKeyForDetailRoute, route, 10000); // 10k senconds

    const metadata = {
        route
    };

    return new OK({metadata}).send(res);
}

const searchByStationIds = async (req, res, next) => {
    const { from, to } = req.query;
    if(!from || !to) {
        return new BadRequestError('Err::: missing from or to in query');
    };

    const redisKeyForSearchSchedule = 'SEARCH_STATION::' + `from=${from}::to=${to}`;
    let schedules = await redisService.getString(redisKeyForSearchSchedule);
    if(schedules) {
        const metadata = {
            schedules
        };

        return new OK({metadata}).send(res);
    }

    schedules = await routeService.searchByStationIds(from, to);

    if(schedules && schedules.length > 0) {
        await redisService.setString(redisKeyForSearchSchedule, schedules, 10000); // 10k senconds
    }

    const metadata = { schedules };

    return new OK({metadata}).send(res);
}

module.exports.routeClientController = {
    getAllRoutes, detailRouteByRouteId, searchByStationIds
}