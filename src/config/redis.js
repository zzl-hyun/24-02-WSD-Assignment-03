const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PSWD,
});

redisClient.on('connect', () => {
  console.log('Redis Connected...');
  // console.log('REDIS_HOST:', process.env.REDIS_HOST);
  // console.log('REDIS_PORT:', process.env.REDIS_PORT);
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('end', () => {
  console.log('Redis connection closed');
});

module.exports = redisClient;
