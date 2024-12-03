const express = require('express');
const router = express.Router();
const User = require('../models/User'); // User 모델 가져오기

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
router.get('/all', async (req, res) => {
    try {
        const users = await User.find(); // 모든 사용자 데이터 조회
        res.json(users); // 데이터를 JSON 형식으로 반환
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
