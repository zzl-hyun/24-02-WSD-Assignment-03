const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  updateProfile,
} = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/authenticateToken');
const {validateRegister} = require('../middlewares/validators');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원 관리 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원 가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: 성공적으로 회원 가입됨.
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청.
 *       500:
 *         description: Failed to create user
 */
router.post('/register', validateRegister, register);

// 로그인
router.post('/login', login);

// 토큰 갱신
router.post('/refresh', refreshToken);

// 회원 정보 수정
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
