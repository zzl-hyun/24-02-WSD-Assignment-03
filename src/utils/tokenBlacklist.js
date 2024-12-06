const redisClient = require('../config/redis');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

const setAsync = (key, value, expiry) =>
  redisClient.set(key, value, { EX: expiry });

const getAsync = (key) => 
  redisClient.get(key);

const addToBlacklist = async (token, expirationTime) => {
  try {
    const reply = await setAsync(token, 'blacklisted', expirationTime);
    console.log('Adding to blacklist:', token, expirationTime);
    return reply;
  } catch (err) {
    console.error('Redis error while adding to blacklist:', err);
    throw new AppError(
      errorCodes.SERVER_ERROR.code, 
      err.message, 
      errorCodes.SERVER_ERROR.status
    );
  }
};

const isBlacklisted = async (token) => {
  try {
    console.log('Checking blacklist for token:', token);
    const result = await getAsync(token);
    console.log('Redis result:', result);
    return result === 'blacklisted';
  } catch (err) {
    console.error('Redis error while checking blacklist:', err);
    throw new AppError(
      errorCodes.SERVER_ERROR.code, 
      err.message, 
      errorCodes.SERVER_ERROR.status
    );
  }
};

module.exports = { addToBlacklist, isBlacklisted };
