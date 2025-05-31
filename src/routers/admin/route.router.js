'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { routeController } = require('../../controllers/admin/route.controller');
const router = express.Router();


router.get('/', asyncHandler(routeController.getAllRoutes));
router.get('/:routeId', asyncHandler(routeController.getOneRouteByRouteId));
router.post('/create', asyncHandler(routeController.createRoute));
router.post('/create/list', asyncHandler(routeController.createListRoutes));
router.patch('/edit/:routeId', asyncHandler(routeController.editRouteByRouteId));


module.exports = router;