// services/job.service.js
const Job = require('../models/job'); // Job 스키마 불러오기

// 데이터베이스에서 모든 채용 공고를 가져오는 비즈니스 로직
const getAllJobs = async () => {
    try {
        const jobs = await Job.find(); // MongoDB에서 모든 Job 데이터 조회
        return jobs;
    } catch (error) {
        throw new Error('Failed to fetch jobs');
    }
};

module.exports = { getAllJobs };
