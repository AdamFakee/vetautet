const { BadRequestError } = require("../../core/error.response");
const { OK } = require("../../core/success.response");
const { scheduleService } = require("../../services/database/schedule.service");
const { redisService } = require("../../services/others/redis.service");


const getAllSchedule = async (req, res, next) => {
    const { page = 1, limit = 40} = req.query;

    const redisKeyForAllSchedule = 'SCHEDULE_ALL::' + `page=${page}::limit=${limit}`;
    let schedules = await redisService.getString(redisKeyForAllSchedule);
    if(schedules && schedules.length > 0) {
        const metadata = {
            schedules
        };

        return new OK({metadata}).send(res);
    }

    schedules = await scheduleService.getAllSchedules({
        page, limit
    });

    if(schedules && schedules.length > 0) {
        await redisService.setString(redisKeyForAllSchedule, schedules, 10000); // 10k senconds
    }

    const metadata = {
        schedules
    }

    return new OK({metadata}).send(res)
}

module.exports.scheduleClientController = {
    getAllSchedule
}