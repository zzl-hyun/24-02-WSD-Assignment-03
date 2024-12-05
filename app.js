// app.js
require('dotenv').config();
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const app = express();
const { swaggerUi, specs } = require("./swagger/config");
const connectDB = require('./config/db');
const redisClient = require('./config/redis');
const errorHandler = require('./middlewares/errorHandler');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');
const cors = require('cors');

// MongoDB 연결
connectDB();

// Redis 연결
// Redis 클라이언트 연결 확인
(async () => {
  try {
    await redisClient.connect(); // Redis 연결
  } catch (err) {
    console.error(err);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 추가기능
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(xssClean());
app.use(cors({
  origin: 'http://113.198.66.75:10042',
  credentials: true, // 쿠키 허용
}));
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 50, // 최대 50 요청
  message: 'Too many requests, please try again later.',
});

// route
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
// const usersRouter = require('./routes/users');
// const authRouter = require('./routes/auth');
// const jobsRouter = require('./routes/jobs');
app.use('/', indexRouter);
app.use('/api', apiLimiter, apiRouter);
// app.use('/api/users', apiLimiter, usersRouter);
// app.use('/api/auth', authRouter);
// app.use('/api/jobs', jobsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
