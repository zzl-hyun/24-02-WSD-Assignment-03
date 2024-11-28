const express = require('express');
const router = express.Router();
const User = require('../models/User'); // User 모델 가져오기



/**
 * @swagger
 * /users:
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
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // 모든 사용자 데이터 조회
        res.json(users); // 데이터를 JSON 형식으로 반환
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to create user
 */
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password }); // 새 사용자 생성
        await newUser.save(); // 데이터베이스에 저장
        res.status(201).json(newUser); // 생성된 사용자 반환
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;
