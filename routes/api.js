const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtextion = csrf({cookie: true});

const usersRouter = require('./users');
const authRouter = require('./auth');
const jobsRouter = require('./jobs');
const applicationRouter = require('./applications');
/**
 * @swagger
 * tags:
 *   name: CSRF
 *   description: CSRF 토큰 발급
 */
/**
 * @swagger
 * /csrf-token:
 *   get:
 *     summary: "CSRF 토큰 요청"
 *     description: "CSRF 보호를 위해 필요한 CSRF 토큰을 요청합니다."
 *     tags: [CSRF]
 *     responses:
 *       200:
 *         description: "CSRF 토큰을 반환합니다."
 *         headers:
 *           Set-Cookie:
 *             description: "CSRF 토큰이 XSRF-TOKEN 쿠키에 저장됩니다."
 *             schema:
 *               type: string
 *               example: "XSRF-TOKEN=your-token-value; Path=/; HttpOnly; Secure"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 *                   example: "your-csrf-token-value"
 */
router.get('/csrf-token', csrfProtextion, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false, // JavaScript에서 접근 가능
        sameSite: 'strict', // CSRF 공격 완화
    });

    res.status(200).json({ csrfToken: req.csrfToken() });
});

router.use('/users', usersRouter); // /api/users
router.use('/auth', csrfProtextion, authRouter);   // /api/auth
router.use('/jobs', jobsRouter);   // /api/jobs
router.use('/applications', csrfProtextion, applicationRouter);

module.exports = router;
