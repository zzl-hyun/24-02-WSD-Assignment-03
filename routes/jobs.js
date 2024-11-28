const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
/**
 * @swagger
 * paths:
 *  /getJobs:
 *    get:
 *      summary: 채용 공고 리스트 조회
 *      responses:
 *         200:
 *           description: 성공적으로 데이터를 가져옴
 */
router.get('/getJobs', jobController.getAllJobs);
module.exports = router;
