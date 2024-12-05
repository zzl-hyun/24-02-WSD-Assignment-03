const redisClient = require('../config/redis');

// Promise 기반 메서드 사용
const setAsync = (key, value, expiry) =>
  redisClient.set(key, value, { EX: expiry });
const getAsync = (key) => redisClient.get(key);

const addToBlacklist = async (token, expirationTime) => {
  try {
    const reply = await setAsync(token, 'blacklisted', expirationTime);
    console.log('Adding to blacklist:', token, expirationTime);
    return reply;
  } catch (err) {
    console.error('Redis error while adding to blacklist:', err);
    throw new Error('Failed to add token to blacklist');
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
    throw new Error('Failed to check token in blacklist');
  }
};

module.exports = { addToBlacklist, isBlacklisted };
