const express = require('express');
const router = express.Router();
const { getJobs } = require('../controllers/job.controller');
const { getAllJobs } = require('../services/job.service')
/**
 * @swagger
 * paths:
 *  /jobs:
 *    get:
 *      summary: 채용 공고 리스트 조회
 *      responses:
 *         200:
 *           description: 성공적으로 데이터를 가져옴
 */
router.get('/getJobs', getJobs);
router.get('/getAllJobs', getAllJobs)
module.exports = router;
