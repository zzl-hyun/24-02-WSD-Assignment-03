const jobService = require('../services/job.service');

// Fetch job listings
exports.getJobs = async (req, res, next) => {
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
      education,
      salary,
      skills
    } = req.query;

    const filters = {
      keyword,
      company,
      position,
      location,
      experience,
      education,
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
    next(error);
  }
};

exports.getJobDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch job details, update view count, and get related jobs
    const { jobDetails, relatedJobs } = await jobService.getJobDetails(id);

    res.status(200).json({
      status: 'success',
      data: {
        jobDetails,
        relatedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

