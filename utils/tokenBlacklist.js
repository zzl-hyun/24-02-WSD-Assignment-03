const redisClient = require('../config/redis');

/**
 * 블랙리스트에 토큰 추가
 * @param {string} token - Access Token
 * @param {number} expirationTime - 만료 시간 (초 단위)
 */
const addToBlacklist = (token, expirationTime) => {
  return new Promise((resolve, reject) => {
    redisClient.set(token, 'blacklisted', 'EX', expirationTime, (err, reply) => {
      if (err) return reject(err);
      resolve(reply);
    });
  });
};

/**
 * 토큰이 블랙리스트에 있는지 확인
 * @param {string} token - Access Token
 * @returns {Promise<boolean>}
 */
const isBlacklisted = (token) => {
  return new Promise((resolve, reject) => {
    redisClient.get(token, (err, reply) => {
      if (err) return reject(err);
      resolve(reply === 'blacklisted');
    });
  });
};

module.exports = {
  addToBlacklist,
  isBlacklisted,
};
