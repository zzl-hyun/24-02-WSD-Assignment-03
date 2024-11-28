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
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const jobsRouter = require('./routes/jobs');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/getjobs', jobsRouter);
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
