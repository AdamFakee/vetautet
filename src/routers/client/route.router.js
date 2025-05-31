'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { routeClientController } = require('../../controllers/client/route.controller');
const router = express.Router();


router.get('/', asyncHandler(routeClientController.getAllRoutes));
router.get('/detail/:routeId', asyncHandler(routeClientController.detailRouteByRouteId));
router.get('/search', asyncHandler(routeClientController.searchByStationIds))

module.exports = router;