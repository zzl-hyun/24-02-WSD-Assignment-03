const jobService = require('../services/job.service');

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs(); // 서비스 호출
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
