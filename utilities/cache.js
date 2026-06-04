const { redisClient } = require("./../config/redis");

//Get cache
const getCache = async (key) => {
  const data = await redisClient.get(key);

  return data ? JSON.parse(data) : null;
};

//Set cache
const setCache = async (key, value, expiration = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: expiration });
};

//Delete cache
const deleteCache = async (key) => {
    await redisClient.del(key);
};

//Delete by pattern
const deleteCacheByPattern = async (pattern) => {
  const keys = await redisClient.keys(pattern);

  if(keys.length > 0) {
    await redisClient.del(keys);
  }
}

module.exports = {
    getCache,
    setCache,
    deleteCache,
    deleteCacheByPattern
};