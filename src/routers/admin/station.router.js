'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { authentication } = require('../../middlewares/client/authentication.middleware');
const { stationController } = require('../../controllers/admin/station.controller');
const router = express.Router();


router.get('/', asyncHandler(stationController.getAllStations));
router.get('/:stationId', asyncHandler(stationController.getOneStationByStationId));
router.post('/create', asyncHandler(stationController.createStation));
router.post('/create/list', asyncHandler(stationController.createListStation));
router.patch('/edit/:stationId', asyncHandler(stationController.editStationByStationId));


module.exports = router;