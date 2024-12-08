const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtextion = csrf({cookie: true});

const adminRouter = require('./api/admin');
const authRouter = require('./api/auth');
const applicationRouter = require('./api/applications');
const bookmarkRouter = require('./api/bookmarks');
const jobsRouter = require('./api/jobs');
const notificationRouter = require('./api/notifications');
// const usersRouter = require('./api/users');
const debugRouter = require('./api/debug');
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
        httpOnly: false, 
        sameSite: 'strict',
    });

    res.status(200).json({ csrfToken: req.csrfToken() });
});

// router.use('/users', usersRouter); 
router.use('/admin',csrfProtextion, adminRouter);
router.use('/auth', csrfProtextion, authRouter);   
router.use('/applications', csrfProtextion, applicationRouter);
router.use('/bookmarks', csrfProtextion, bookmarkRouter);
router.use('/jobs', csrfProtextion, jobsRouter);   
router.use('/notifications', notificationRouter);

router.use('/debug', debugRouter);

module.exports = router;
