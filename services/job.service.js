// services/job.service.js
const Job = require('../models/Job'); // Job 스키마 불러오기

// Fetch job listings with pagination, filtering, and sorting
exports.getJobs = async ({ page, size, sortBy, sortOrder, filters }) => {
  const query = {};

  // Filtering
  if (filters.keyword) {
    query.$or = [
      { jobTitle: { $regex: filters.keyword, $options: 'i' } },
      { link: { $regex: filters.keyword, $options: 'i' } },
    ];
  }
  if (filters.company) {
    query.companyId = filters.company; // Assuming companyId is provided as a filter
  }
  if (filters.position) {
    query.jobTitle = { $regex: filters.position, $options: 'i' };
  }
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }
  if (filters.experience) {
    query.experienceRequired = filters.experience;
  }
  if (filters.salary) {
    query.salary = { $regex: filters.salary, $options: 'i' };
  }
  if (filters.skills) {
    query['details.skills'] = { $all: filters.skills.split(',') };
  }

  // Pagination
  const limit = parseInt(size, 10) || 20;
  const skip = (parseInt(page, 10) - 1) * limit;

  // Sorting
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  // Fetching data
  const jobs = await Job.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Count total documents for pagination metadata
  const totalJobs = await Job.countDocuments(query);

  return {
    jobs,
    pagination: {
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalJobs / limit),
      totalItems: totalJobs,
    },
  };
};

// MongoDB에서 모든 Job 데이터 조회
exports.getAllJobs = async () => {
    return await Job.find();
};

