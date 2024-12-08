const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const jobController = require('../../controllers/job.controller');
const Application = require('../../models/Application');
const Bookmark = require('../../models/Bookmark');
const Company = require('../../models/Company');
const Job = require('../../models/Job');
const LoginHistory = require('../../models/LoginHistory');
const Token = require('../../models/Token');
const User = require('../../models/User'); 
const Notification = require('../../models/Notification'); 
const authenticateToken = require('../../middlewares/authenticateToken');


/**
 * @swagger
 * tags:
 *   name: Debug
 *   description: 디버깅용 API
 */

/**
 * @swagger
 * /debug/application:
 *   get:
 *     summary: Application collection 조회
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A list of Applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/application', async (req, res, next) => {
    try {
        const applications = await Application.find(); // 모든 사용자 데이터 조회
        res.status(200).json({status: 'success', data: applications}); // 데이터를 JSON 형식으로 반환
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /debug/bookmark:
 *   get:
 *     summary: Bookmark collection 조회
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A list of bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 */
router.get('/bookmark', async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find(); // 모든 사용자 데이터 조회
        res.status(200).json({status: 'success', data: bookmarks}); // 데이터를 JSON 형식으로 반환
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 *  /debug/job:
 *    get:
 *      summary: Job collection 조회
 *      tags: [Debug]
 *      responses:
 *         200:
 *           description: 성공적으로 데이터를 가져옴
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: success
 *                    data:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Job'
 */
router.get('/job', async(req, res, next) => {
    try{
        const jobs = await Job.find();
        res.status(200).json({status: 'success', data: jobs});
    }catch (err){
        next(err);
    }
});

/**
 * @swagger
 * /debug/loginHistory:
 *   get:
 *     summary: LoginHistory collection 조회
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A list of login history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LoginHistory'
 */
router.get('/loginHistory', async(req, res, next) => {
    try{
        const histories = await LoginHistory.find();
        res.status(200).json({status: 'success', data: histories});
    }catch (err){
        next(err);
    }
});

/**
 * @swagger
 * /debug/token:
 *   get:
 *     summary: Token collection 조회
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A list of login history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LoginHistory'
 */
router.get('/token', async(req, res, next) => {
    try{
        const tokens = await Token.find();
        res.status(200).json({status: 'success', data: tokens});
    }catch (err){
        next(err);
    }
});

/**
 * @swagger
 * /debug/token:
 *   post:
 *     summary: accessToken 검증
 *     description: accessToken이 유효한지 테스트
 *     tags: [Debug]
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     responses:
 *       200:
 *         description: accessToken 이 유효하다면 success 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 accessToken:
 *                    type: string
 *                    example: "accessToken..."
 *                 refreshToken:
 *                    type: string
 *                    example: "refreshToken..."
 *       403:
 *         description: accessToken이 유효하지 않으면 error 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/token', authenticateToken, async(req, res, next) => {
    try {
        // Authorization 헤더에서 Access Token 가져오기
        const authHeader = req.header('Authorization');
        const accessToken = authHeader ? authHeader.split(' ')[1] : null;
    
        // 쿠키에서 Refresh Token 가져오기
        const refreshToken = req.cookies.refreshToken;
    
        // 토큰 반환
        res.status(200).json({
          status: 'success',
          access: accessToken || 'No access token provided',
          refresh: refreshToken || 'No refresh token provided',
        });
      } catch (err) {
        next(err); // 에러 미들웨어로 전달
      }
});

/**
 * @swagger
 * /debug/user:
 *   get:
 *     summary: User collection 조회
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/user', async (req, res, next) => {
    try {
        const users = await User.find(); // 모든 사용자 데이터 조회
        res.status(200).json({status: 'success', data: users}); 
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /debug/notification:
 *   get:
 *     summary: notification collection 조회
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A list of notificationx
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/notification', async (req, res, next) => {
    try {
        const notifications = await Notification.find(); // 모든 사용자 데이터 조회
        res.status(200).json({status: 'success', data: notifications}); 
    } catch (err) {
        next(err);
    }
});




module.exports = router;