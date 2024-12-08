const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken');
const isAdmin = require('../../middlewares/isAdmin');
const { validateID ,validateStatus } = require('../../middlewares/validators');
const { getApplications, changeStatus } = require('../../controllers/application.controller');
const { deleteJob, updateJob } = require('../../controllers/job.controller');

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
 *     summary: 지원자 조회
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
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: 반영할 application의 _id
 *         required: true
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: 반영할 status
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
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/applications/:id', authenticateToken, isAdmin, validateID, validateStatus, changeStatus)

/**
 * @swagger
 * /admin/jobs/{id}:
 *   put:
 *     summary: 공고 수정
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 수정할 공고의 _id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 description: 공고 제목
 *                 example: "Software Engineer"
 *               experienceRequired:
 *                 type: string
 *                 description: 필요한 경력
 *                 example: "3+ years in software development"
 *               educationRequired:
 *                 type: string
 *                 description: 필요한 학력
 *                 example: "Bachelor's degree in Computer Science"
 *               employmentType:
 *                 type: string
 *                 description: 고용 형태
 *                 example: "Full-time"
 *               skills:
 *                 type: array
 *                 description: 필요 기술
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js"]
 *               benefits:
 *                 type: array
 *                 description: 제공 혜택
 *                 items:
 *                   type: string
 *                 example: ["Health Insurance", "Stock Options"]
 *               deadline:
 *                 type: string
 *                 description: 지원 마감일
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Job deleted successfully
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
 *                     $ref: '#/components/schemas/Job'
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/jobs/:id', authenticateToken, isAdmin, validateID, updateJob);

/**
 * @swagger
 * /admin/jobs/{id}:
 *   delete:
 *     summary: 공고 삭제
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 삭제할 공고의 _id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordHash:
 *                 type: string
 *                 description: 삭제하려면 관리자 비밀번호가 필요함
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Job deleted successfully
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
 *                     $ref: '#/components/schemas/Job'
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/jobs/:id', authenticateToken, isAdmin, validateID, deleteJob);
module.exports = router;
