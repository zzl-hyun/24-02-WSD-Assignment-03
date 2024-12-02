const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 회사 API
 */
/**
 * @swagger
 *  /jobs:
 *    get:
 *      summary: 채용 공고 리스트 조회
 *      tags: [Jobs]
 *      responses:
 *         200:
 *           description: 성공적으로 데이터를 가져옴
 */
router.get('/', jobController.getAllJobs);
module.exports = router;
