"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRedisRateLimiter = void 0;
const redis = __importStar(require("redis"));
let rateLimit = {
    window_size_in_hours: 24,
    window_max_request_count: 100,
    window_log_interval_in_hours: 1
};
const redisClient = redis.createClient();
exports.customRedisRateLimiter = (req, res, next) => {
    // window changes every request. current timestamp - 24 hours ago === window
    // discard request if request inside window && request_count > max requests
    try {
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        // fetch records of current user using IP address, returns null when no record is found
        redisClient.get(req.ip, function (err, record) {
            if (err) {
                throw err;
            }
            const currentRequestTime = new Date();
            //  if no record is found, create a new record for user and store to redis
            if (record == null) {
                let requestLog = {
                    request_timestamp: currentRequestTime.getTime(),
                    request_count: 1
                };
                let visitorRecord = [requestLog];
                console.log('visitorRecord', visitorRecord);
                redisClient.set(req.ip, JSON.stringify(visitorRecord));
                next();
                // if record is found, parse it's value and calculate # of requests users have made within WINDOW_LOG_INTERVAL_IN_HOURS
            }
            else {
                let visitorRecord = JSON.parse(record);
                let windowRequestTime = new Date();
                let windowStartTimestamp = windowRequestTime.setHours(windowRequestTime.getHours() - rateLimit.window_size_in_hours);
                let requestsWithinWindow = visitorRecord.filter(entry => {
                    return entry.request_timestamp > windowStartTimestamp;
                });
                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.request_count;
                }, 0);
                // return error if # of requests >= rateLimit.window_max_request_count
                if (totalWindowRequestsCount >= rateLimit.window_max_request_count) {
                    let httpResponse = {
                        status_code: 429,
                        message: `You have exceeded the ${rateLimit.window_max_request_count} requests in ${rateLimit.window_size_in_hours} hrs limit!`,
                        data: visitorRecord
                    };
                    try {
                        res.status(httpResponse.status_code)
                            .send({
                            message: httpResponse.message,
                            status: res.status,
                            data: httpResponse.data
                        });
                    }
                    catch (e) {
                        res.status(404).send(e.message);
                    }
                    // if # of requests made < allowed maximum, log new entry
                }
                else {
                    let lastRequestLog = visitorRecord[visitorRecord.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.setHours(currentRequestTime.getHours() - rateLimit.window_log_interval_in_hours);
                    //  if interval has not passed since last request log, increment counter
                    if (lastRequestLog.request_timestamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.request_count++;
                        visitorRecord[visitorRecord.length - 1] = lastRequestLog;
                    }
                    console.log('visitorRecord', visitorRecord);
                    redisClient.set(req.ip, JSON.stringify(visitorRecord));
                    next();
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};
