const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken');
const {toggleBookmark, getBookmarks} = require('../../controllers/bookmark.controller');
const { validateID } = require('../../middlewares/validators'); 
/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 관리 API
 */

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 추가/제거
 *     tags: [Bookmarks]
 *     security:
 *       - csrfAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: string
 *                 description: 북마크할 Job의 ID
 *                 example: "63e88cfd9b7e2c22c8a3b91b"
 *     responses:
 *       200:
 *         description: 북마크 추가/제거 성공
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
 *                   example: "Bookmark added/removed successfully"
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticateToken, validateID, toggleBookmark);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 북마크 목록 조회
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: 페이지 번호
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: 한 페이지당 북마크 개수
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: 북마크 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "63e88cfd9b7e2c22c8a3b91b"
 *                       job_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "63e88cfd9b7e2c22c8a3b91b"
 *                           title:
 *                             type: string
 *                             example: "Software Engineer"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-06T12:00:00.000Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 */
router.get('/', authenticateToken, getBookmarks);

module.exports = router;
