'use strict';
const data = require('../../data/trains.json');
const { trainModel } = require('../../models/train_system/train.model');

const getAllTrains = async (opts = {}) => {
    const { limit = 10, page = 1 } = opts;
    const offset = (page - 1) * limit;
    return await trainModel.findAll({
        where: {
            status: 'active'
        }, 
        limit: Number(limit),
        offset: Number(offset),
        raw: true,
    })
}

const getOneTrainByTrainId = async (train_id) => {
    return await trainModel.findAll({
        where: {
            train_id,
            status: 'active'
        }, 
        raw: true,
    })
}

const createTrain = async (payload) => {
    return await trainModel.create(payload);
}

// tạo 1 list data để test 
const createListTrain = async () => {
    const amount = data.length;

    const promises = [];
    for(let i = 0; i < amount; i++) {
        promises.push(createTrain(data[i]))
    }


    return await Promise.all(promises); 
}

const editTrainByTrainId = async (train_id, payload) => {
    return await trainModel.update(payload, {
        where: { 
            train_id,
        },
        raw: true
    });
}

module.exports.trainService = {
    editTrainByTrainId, createTrain, getAllTrains, getOneTrainByTrainId, createListTrain
}