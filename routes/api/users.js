const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // User 모델 가져오기
const LoginHistory = require('../../models/LoginHistory');
/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
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
router.get('/all', async (req, res, next) => {
    try {
        const users = await User.find(); // 모든 사용자 데이터 조회
        res.status(200).json({status: 'success', data: users}); // 데이터를 JSON 형식으로 반환
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /users/loginHistory:
 *   get:
 *     summary: Retrieve a login history list of users
 *     tags: [Users]
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
module.exports = router;
