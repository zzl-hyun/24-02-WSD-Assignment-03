const express = require('express');
const router = express.Router();
const { createApplication, getApplications, deleteApplication } = require('../controllers/application.controller');
const authenticateToken = require('../middlewares/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 지원 API
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Apply for a job
 *     tags:
 *       - Applications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *                 description: The ID of the job being applied for
 *               resume:
 *                 type: string
 *                 description: The URL or file path of the attached resume
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Bad request or duplicate application
 */
router.post('/', authenticateToken, createApplication);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get user applications
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Filter by application status (Pending, Accepted, etc.)
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (asc or desc)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved applications
 *       400:
 *         description: Bad request
 */
router.get('/', authenticateToken, getApplications);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Cancel an application
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the application to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application cancelled successfully
 *       400:
 *         description: Bad request or cancellation not allowed
 */
router.delete('/:id', authenticateToken, deleteApplication);

module.exports = router;
