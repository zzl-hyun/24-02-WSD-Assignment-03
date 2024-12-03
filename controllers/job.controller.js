const jobService = require('../services/job.service');

// Fetch job listings
exports.getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      size = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      keyword,
      company,
      position,
      location,
      experience,
      salary,
      skills
    } = req.query;

    const filters = {
      keyword,
      company,
      position,
      location,
      experience,
      salary,
      skills,
    };

    const { jobs, pagination } = await jobService.getJobs({
      page,
      size,
      sortBy,
      sortOrder,
      filters,
    });

    res.status(200).json({
      status: 'success',
      data: jobs,
      pagination,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};



exports.getAllJobs = async (req, res) => {
  try {
      const jobs = await jobService.getAllJobs(); // 서비스 호출
      res.status(200).json({
        status: 'success',
        data: jobs,
      });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
