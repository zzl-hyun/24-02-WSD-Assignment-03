const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const jobsRouter = require('./jobs');

// 하위 라우터 연결
router.use('/users', usersRouter); // /api/users
router.use('/auth', authRouter);   // /api/auth
router.use('/jobs', jobsRouter);   // /api/jobs

module.exports = router;
