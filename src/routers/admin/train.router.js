'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { trainController } = require('../../controllers/admin/train.controller');
const router = express.Router();


router.get('/', asyncHandler(trainController.getAllTrains));
router.get('/:trainId', asyncHandler(trainController.getOneTrainByTrainId));
router.post('/create', asyncHandler(trainController.createTrain));
router.post('/create/list', asyncHandler(trainController.createListTrains));
router.patch('/edit/:trainId', asyncHandler(trainController.editTrainByTrainId));


module.exports = router;