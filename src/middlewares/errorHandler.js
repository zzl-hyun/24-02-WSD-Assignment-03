const winston = require('winston');
require('winston-logstash');
// 로깅 설정
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // 기본 포맷 (파일용)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, code, route, stack }) => {
          const firstAtLine = stack ? stack.split('\n').find(line => line.trim().startsWith('at')) : 'N/A';
          return `[${timestamp}] [${level.toUpperCase()}] Code: ${code || 'N/A'}, Message: ${message}, Route: ${route || 'N/A'}, Location: ${firstAtLine}`;
        })
      ),
    }),
    new winston.transports.File({ filename: './logs/errors.log' }),
  ],
});

const errorHandler = (err, req, res, next) => {
  // console.log('Error Object', err);

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
