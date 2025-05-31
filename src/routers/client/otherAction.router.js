'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { redisService } = require('../../services/others/redis.service');
const router = express.Router();


router.get('/clearRedis', asyncHandler(async (req, res, next) => {
    await redisService.clear();
    res.json('clear redis ok')
}));

module.exports = router;