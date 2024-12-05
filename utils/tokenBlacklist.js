const redisClient = require('../config/redis');

// Promise 기반 메서드 사용
const setAsync = (key, value, expiry) =>
  redisClient.set(key, value, { EX: expiry });
const getAsync = (key) => redisClient.get(key);

const addToBlacklist = async (token, expirationTime) => {
  try {
    const reply = await setAsync(token, 'blacklisted', expirationTime);
    return reply;
  } catch (err) {
    console.error('Redis error while adding to blacklist:', err);
    throw new Error('Failed to add token to blacklist');
  }
};

const isBlacklisted = async (token) => {
  try {
    const result = await getAsync(token);
    return result === 'blacklisted';
  } catch (err) {
    console.error('Redis error while checking blacklist:', err);
    throw new Error('Failed to check token in blacklist');
  }
};

module.exports = { addToBlacklist, isBlacklisted };
