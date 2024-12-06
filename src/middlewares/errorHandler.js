const winston = require('winston');
require('winston-logstash');
// 로깅 설정
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './logs/errors.log' }),
    new winston.transports.Console(),
  ],
});

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    code: err.code,
    stack: err.stack,
    route: req.originalUrl,
  });

  res.status(err.status || 500).json({
    status: 'error',
    code: err.code || 'SERVER_ERROR',
    message: err.message || 'Internal Server Error',
  });
};


module.exports = errorHandler;
