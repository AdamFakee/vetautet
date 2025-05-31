'use strict';

const { NotFoundError, BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { trainService } = require("../../services/database/train.service");

const getAllTrains = async (req, res, next) => {
    const trains = await trainService.getAllTrains(req.query);
    if(trains.length == 0) {
        return new NotFoundError('err::: not found trains').send(res);
    }

    const metadata = {
        trains
    };

    return new OK({metadata}).send(res);
}

const getOneTrainByTrainId = async (req, res, next) => {
    const { trainId } = req.params;
    if(!trainId) {
        return new BadRequestError('Err:::: not contain trainId').send(res);
    }

    const train = await trainService.getOneTrainByTrainId(trainId);
    if(!train) {
        return new NotFoundError('err::: not found train').send(res);
    }

    const metadata = {
        train
    };

    return new OK({metadata}).send(res);
}

const createTrain = async (req, res, next) => {
    const payload = req.body;
    // validation

    const result = await trainService.createTrain(payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

const createListTrains = async (req, res, next) => {
    
    await trainService.createListTrain();

    return new OK({}).send(res);
}


const editTrainByTrainId = async (req, res, next) => {
    const { trainId } = req.params;
    const payload = req.body;
    if(!trainId || !payload) {
        return new BadRequestError('Err:::: not contain trainId or payload').send(res);
    }

    const result = await trainService.editTrainByTrainId(trainId, payload);

    const metadata = {
        result
    };

    return new OK({metadata}).send(res);
}

module.exports.trainController = {
    editTrainByTrainId, getAllTrains, getOneTrainByTrainId, createTrain, createListTrains
}