const express = require('express');
const router = express.Router();
const {
    getJobs,
    getAllJobs,
    getJobDetails,
} = require('../../controllers/job.controller');
const { validateID } = require('../../middlewares/validators');
/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용공고 API
 */
/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get job listings
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: size
 *         in: query
 *         description: Number of jobs per page
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         schema:
 *           type: string
 *           default: createdAt
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (asc or desc)
 *         schema:
 *           type: string
 *           default: desc
 *       - name: keyword
 *         in: query
 *         description: Keyword to search in job title or description
 *         schema:
 *           type: string
 *       - name: company
 *         in: query
 *         description: Filter by company ID
 *         schema:
 *           type: string
 *       - name: position
 *         in: query
 *         description: (정규직...)
 *         schema:
 *           type: string
 *       - name: location
 *         in: query
 *         description: (안양...)
 *         schema:
 *           type: string
 *       - name: experience
 *         in: query
 *         description:  (신입, 경력...)
 *         schema:
 *           type: string
 *       - name: education
 *         in: query
 *         description: (고졸...)
 *         schema:
 *            type: string
 *       - name: salary
 *         in: query
 *         description: (3000만원...)
 *         schema:
 *           type: string
 *       - name: skills
 *         in: query
 *         description: comma-separated (C, Java...)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved job listings
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
 *                 pagination:
 *                  properties:
 *                      totalJobs:
 *                          type: integer
 *                      currentPage:
 *                          type: integer
 *                      totalPages:
 *                          type: integer
 */
router.get('/', getJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job details
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Job ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved job details
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
 *                     jobDetails:
 *                       $ref: '#/components/schemas/Job'
 *                     relatedJobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
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
 *                   example: Job not found.
 */
router.get('/:id', validateID, getJobDetails);

module.exports = router;
