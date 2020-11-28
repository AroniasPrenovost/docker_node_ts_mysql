import * as redis from 'redis';

const redisClient = redis.createClient();
const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 100;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

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
        
        //  if no record is found , create a new record for user and store to redis
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
        
        // if record is found, parse it's value and calculate number of requests users has made within the last window
        let data = JSON.parse(record);

        let windowRequestTime = new Date(); 
        let windowStartTimestamp = windowRequestTime.setHours(windowRequestTime.getHours() - WINDOW_SIZE_IN_HOURS);

        let requestsWithinWindow = data.filter(entry => {
            return entry.requestTimeStamp > windowStartTimestamp;
        });
        
        console.log('requestsWithinWindow', requestsWithinWindow);
        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
        }, 0);

        // if number of requests made is greater than or equal to the desired maximum, return error
        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            res
            .status(429)
            .jsend.error(
                `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
            );
        } else {
            
            // if number of requests made is less than allowed maximum, log new entry
            let lastRequestLog = data[data.length - 1];
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.setHours(currentRequestTime.getHours() - WINDOW_LOG_INTERVAL_IN_HOURS);

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
