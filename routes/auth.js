const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  updateProfile,
  deleteProfile,
} = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/authenticateToken');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
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
 *             type: object
 *             required:
 *                - username
 *                - email
 *                - passwordHash
 *                - fullName
 *                - phoneNumber
 *             properties:
 *                username:
 *                  type: string
 *                  example: john_doe
 *                email:
 *                  type: string
 *                  format: email
 *                  example: user@example.com
 *                passwordHash:
 *                  type: string
 *                  example: securepassword
 *                role:
 *                  type: string
 *                  enum: [jobseeker, admin]
 *                  example: jobseeker
 *                companyId:
 *                  type: objectId
 *                profile:
 *                   type: object
 *                   required:
 *                     - fullName
 *                     - phoneNumber
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     phoneNumber:
 *                       type: string
 *                       example: 123-456-7890
 *                     bio:
 *                       type: string
 *                       example: A passionate developer
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["JavaScript", "React"]
 *                     resumeUrl:
 *                       type: string
 *                       format: uri
 *                       example: http://example.com/resume.pdf
 *     responses:
 *       201:
 *         description: 성공적으로 회원 가입됨.
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       400:
 *         description: Email is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to create user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: 로그인 성공. Access Token 반환.
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh Token
 *     description: 헤더 또는 본문에 refreshToken을 제공하여 새로운 Access Token을 발급받습니다.
 *     tags: [Auth]
 *     security:
 *       - refreshToken: []
 *       - csrfAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: 새로운 Access Token 발급
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
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Refresh Token 누락
 *       403:
 *         description: Refresh Token 인증 실패
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 사용자 업데이트
 *     description: CSRF로 보호됨
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *                 example: Joe Biden
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *                 example: "123-456-7890"
 *               bio:
 *                 type: string
 *                 description: Short bio of the user
 *                 example: "Game developer with 5 years of experience"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills
 *                 example: ["C++", "C#", "C"]
 *               resumeUrl:
 *                 type: string
 *                 description: URL of the user's resume
 *                 example: "https://example.com/resume.pdf"
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password
 *                 example: oldPasswd
 *               newPassword:
 *                 type: string
 *                 description: The user's new password
 *                 example: newPasswd
 *     responses:
 *       200:
 *         description: Profile and/or password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Profile and/or password updated successfully.
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Token has expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Delete user profile
 *     description: This endpoint allows the authenticated user to delete their profile by providing their password.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []  # Authentication via JWT
 *       - csrfAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordHash:
 *                 type: string
 *                 description: The user's password to confirm identity before deleting the profile
 *                 example: "userPassword123"
 *     responses:
 *       200:
 *         description: Profile successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Profile deleted successfully"
 *       400:
 *         description: Incorrect password or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 *       401:
 *         description: Unauthorized access, authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Authentication failed"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.delete('/delete', authenticateToken, deleteProfile);


module.exports = router;
