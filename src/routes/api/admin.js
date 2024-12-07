const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken');
const isAdmin = require('../../middlewares/isAdmin');
const { validateID ,validateStatus } = require('../../middlewares/validators');
const { getApplications, changeStatus } = require('../../controllers/application.controller');


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 API
 */

/**
 * @swagger
 * /admin/applications:
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
router.get('/applications', authenticateToken, isAdmin, getApplications);

/**
 * @swagger
 * /admin/applications/{id}:
 *   put:
 *     summary: 지원서 수락/거절
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the application to update
 *         required: true
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: The new status of the application
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - Accepted
 *             - Rejected
 *           example: Accepted
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *                     $ref: '#/components/schemas/Application'
 */
router.put('/applications/:id', authenticateToken, isAdmin, validateID, validateStatus, changeStatus)
module.exports = router;
