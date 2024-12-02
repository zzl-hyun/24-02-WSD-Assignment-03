const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  updateProfile,
} = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/authenticateToken');
const {
  validateRegister,
  validateLogin,
} = require('../middlewares/validators');
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 사용자 인증 후 JWT Access Token과 Refresh Token을 반환합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자의 이메일 주소
 *                 example: user@example.com
 *               passwordHash:
 *                 type: string
 *                 description: 사용자의 비밀번호
 *                 example: password123
 *             required:
 *               - email
 *               - passwordHash
 *     responses:
 *       200:
 *         description: 로그인 성공. Access Token과 Refresh Token 반환.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: 인증을 위한 JWT Access Token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       description: 새로운 Access Token을 발급받기 위한 Refresh Token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Invalid email format", "Password must be at least 4 characters long"]
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid email or password.
 */
router.post('/login', validateLogin, login);

// 토큰 갱신
router.post('/refresh', refreshToken);

// 회원 정보 수정
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
