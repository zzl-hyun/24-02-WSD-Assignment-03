// app.js
require('dotenv').config();
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const app = express();
const { swaggerUi, specs } = require("./config/swagger");
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');


connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(xssClean());

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 5, // 최대 100 요청
  message: 'Too many requests, please try again later.',
});

// route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
app.use('/', indexRouter);
app.use('/users', apiLimiter, usersRouter);
app.use('/auth', authRouter);
app.use('/jobs', jobsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
