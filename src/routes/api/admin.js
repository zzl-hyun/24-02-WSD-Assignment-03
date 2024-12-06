const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken');
const isAdmin = require('../../middlewares/isAdmin');
const { getApplications } = require('../../controllers/application.controller');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 API
 */

/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     summary: 지원 내역 조회
 *     tags: [Admin]
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *          application/json:
 *              schema: 
 *                  type:
 *                  properties:
 *                      status:
 *                          type: string
 *                          example: success
 *                      data:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Application'
 */
router.get('/jobs', authenticateToken, isAdmin, getApplications);

module.exports = router;
