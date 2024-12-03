// services/job.service.js
const Job = require('../models/Job'); // Job 스키마 불러오기
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

// Fetch job listings with pagination, filtering, and sorting
exports.getJobs = async ({ page, size, sortBy, sortOrder, filters }) => {
  const query = {};
  const parseSalary = (salaryString) => {
    if (!salaryString) return null;

    const regex = /([\d,]+)\s*(만원|원)/i;
    const match = salaryString.match(regex);

    if (!match) return null;

    const rawValue = parseInt(match[1].replace(/,/g, ''), 10); // Remove commas and parse the number
    const unit = match[2];

    if (unit === '만원') {
      return rawValue * 10000; // Convert 만원 to 원
    } else if (unit === '원') {
      return rawValue; // Already in 원
    }

    return null;
  };

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
    query.$or = [
    { jobTitle : { $regex: filters.position, $options: 'i' }},
    {  employmentType: { $regex: filters.position, $options: 'i' }},
    ]

  }
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }
  if (filters.experience) {
    query.experienceRequired = filters.experience;
  }
  if (filters.education) {
    query.educationRequired = {$regex: filters.education, $options: 'i'};
  }
  if (filters.salary) {
    const minSalary = parseSalary(filters.salary);
    if (minSalary !== null) {
      query.normalizedSalary = { $gte: minSalary }; // Filter for salaries greater than or equal to the specified value
    }
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

// Fetch job details and update view count
exports.getJobDetails = async (jobId) => {
  // Fetch the job details by ID
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    throw new AppError(errorCodes.JOB_NOT_FOUND.code, errorCodes.JOB_NOT_FOUND.message, errorCodes.JOB_NOT_FOUND.status);
  }

  // Increment the view count (add a viewCount field if not present)
  jobDetails.viewCount = (jobDetails.viewCount || 0) + 1;
  await jobDetails.save();

  // Find related jobs based on similar skills and location
  const relatedJobs = await Job.find({
    _id: { $ne: jobId }, // Exclude the current job
    location: jobDetails.location,
    'details.skills': { $in: jobDetails.details.skills },
  })
      .limit(5) // Limit to 5 related jobs
      .exec();

  return { jobDetails, relatedJobs };
};


// debug
// MongoDB에서 모든 Job 데이터 조회
exports.getAllJobs = async () => {
    return await Job.find();
};

