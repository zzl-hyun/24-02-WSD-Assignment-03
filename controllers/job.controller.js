const { getAllJobs } = require('../services/job.service');

exports.getJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs(); // 서비스 호출
        res.status(200).json(jobs); // 클라이언트로 응답
    } catch (error) {
        res.status(500).json({ message: error.message }); // 에러 처리
    }
};
