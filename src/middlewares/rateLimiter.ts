import * as redis from 'redis';
import { HttpResponse } from '../models/httpResponses/httpResponse.interface';
import { RateLimitConfig } from '../models/rateLimits/rateLimitConfig.interface';
// import { RequestLog, VisitorRecord } from '../models/rateLimits/visitorRecord.interface';

let rateLimit: RateLimitConfig = {
    window_size_in_hours: 24,
    window_max_request_count: 100,
    window_log_interval_in_hours: 1
};

const redisClient = redis.createClient();

export const customRedisRateLimiter = (req, res, next) => {

    try {
        
        // check that redis client exists
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        
        // fetch records of current user using IP address, returns null when no record is found
        redisClient.get(req.ip, function(err, record) {
        if (err) throw err;
        
        const currentRequestTime = new Date(); 
        
        console.log(record);
        
        //  if no record is found, create a new record for user and store to redis
        if (record == null) {
            let newRecord = [];
            let requestLog = {
                requestTimeStamp: currentRequestTime.getTime(),
                requestCount: 1
            };
            newRecord.push(requestLog);
            redisClient.set(req.ip, JSON.stringify(newRecord));
            next();
        }
        
        // if record is found, parse it's value and calculate # of requests users has made within WINDOW_LOG_INTERVAL_IN_HOURS
        let data = JSON.parse(record);

        let windowRequestTime = new Date(); 
        let windowStartTimestamp = windowRequestTime.setHours(windowRequestTime.getHours() - rateLimit.window_size_in_hours);

        let requestsWithinWindow = data.filter(entry => {
            return entry.requestTimeStamp > windowStartTimestamp;
        });
        
        console.log('requestsWithinWindow', requestsWithinWindow);
        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
        }, 0);

        // return error if # of requests >= rateLimit.window_max_request_count
        if (totalWindowRequestsCount >= rateLimit.window_max_request_count) {

            let httpResponse: HttpResponse = {
                status_code: 429, 
                message: `You have exceeded the ${rateLimit.window_max_request_count} requests in ${rateLimit.window_size_in_hours} hrs limit!`,
                data: {}
            };

            try {
                res.status(httpResponse.status_code)
                .send({
                  message: httpResponse.message,
                  status: res.status,
                  data
                });
            
              } catch (e) {
                res.status(404).send(e.message);
              } 

        } else {
            
            // if number of requests made is less than allowed maximum, log new entry
            let lastRequestLog = data[data.length - 1];
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.setHours(currentRequestTime.getHours() - rateLimit.window_log_interval_in_hours);

            //  if interval has not passed since last request log, increment counter
            if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                lastRequestLog.requestCount++;
                data[data.length - 1] = lastRequestLog;
            } else {

                //  if interval has passed, log new entry for current user and timestamp
                data.push({
                    requestTimeStamp: currentRequestTime.getTime,
                    requestCount: 1
                });
            }
            redisClient.set(req.ip, JSON.stringify(data));
            next();
        }
        });
    } catch (error) {
        next(error);
    }
};
