const { createClient } = require("redis");
const logger = require("./../utilities/logger");

//Node.js app to communicate with Redis server
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

//Connect redis
const connectRedis = async () => {
  try {
    await redisClient.connect();

    logger.info("Redis Connected");
  } catch (err) {
    logger.error("Redis Connection Failed");
    logger.error(err);
  }
};

//Redis events
redisClient.on("error", (err) => {
  logger.error("Redis error");
  logger.error(err);
});

module.exports = {
  redisClient,
  connectRedis,
};
