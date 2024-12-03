const morgan = require('morgan');

const logger = morgan('dev'); // 'dev' 형식으로 로깅

module.exports = logger;

