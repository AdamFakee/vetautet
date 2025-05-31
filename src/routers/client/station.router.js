'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { stationClientController } = require('../../controllers/client/station.controller');
const router = express.Router();


router.get('/', asyncHandler(stationClientController.getAllStations));


module.exports = router;