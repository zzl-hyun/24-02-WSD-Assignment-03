// services/job.service.js
const Job = require('../models/Job'); // Job 스키마 불러오기
const User = require('../models/User');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

/**
 * 채용공고 조회
 * @param {Object} params
 * @param {Number} params.page
 * @param {Number} params.size
 * @param {String} params.sortBy
 * @param {String} params.sortOrder
 * @param {Object} params.filters
 * @returns 
 */
exports.getJobs = async ({ page, size, sortBy, sortOrder, filters }) => {
  try {  
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
      query.companyId = filters.company; 
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
      query.experienceRequired = {$regex: filters.experience, $options: 'i'};
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

    // console.log('Query:', query);
    // console.log('Sort:', sort);

    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(query);

    return {
      jobs,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalJobs / limit),
        totalItems: totalJobs,
      },
    };
  } 
  catch (error) {
    throw error;
  }
};


/**
 * 공고 상세 조회
 * @param {ObjectId} jobId 
 * @returns 
 */
exports.getJobDetails = async (jobId) => {
  try {  
    const jobDetails = await Job.findById(jobId).populate('companyId');
    console.log(jobDetails);
    if (!jobDetails) {
      throw new AppError(errorCodes.NOT_FOUND.code, 'Job not found.', errorCodes.NOT_FOUND.status);
    }

    // 조회수 증가
    jobDetails.viewCount = (jobDetails.viewCount || 0) + 1;
    await jobDetails.save();

    // 관련공고 탐색
    const relatedJobs = await Job.find({
      _id: { $ne: jobId }, 
      location: jobDetails.location,
      'details.skills': { $in: jobDetails.details.skills },
    })
        .limit(5) 
        .exec();

    return { jobDetails, relatedJobs };
  } 
  catch (error) {
    throw error
  }
};

/**
 * 
 * @param {ObjectId} jobId 
 * @param {Object} jobData 
 * @returns 
 */
exports.updateJob = async (jobId, jobData) => {
  try {
    // 데이터 분리
    const detailsFields = ['skills', 'benefits'];
    const topFields = ['jobTitle', 'experienceRequired', 'educationRequired', 'employmentType', 'deadline'];

    const updateData = {
      ...Object.fromEntries(
        Object.entries(jobData).filter(([key]) => topFields.includes(key))
      ),
      ...Object.fromEntries(
        Object.entries(jobData)
          .filter(([key]) => detailsFields.includes(key))
          .map(([key, value]) => [`details.${key}`, value])
      ),
    };

    // Job 업데이트
    const updateJob = await Job.findByIdAndUpdate(jobId, { $set: updateData }, { new: true });

    if (!updateJob) {
      throw new AppError(
          errorCodes.JOB_NOT_FOUND.code,
          errorCodes.JOB_NOT_FOUND.message,
          errorCodes.JOB_NOT_FOUND.status
      );
    }

    return updateJob;
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param {ObjectId} jobId 
 * @param {ObjectId} userId 
 * @param {String} passwordHash 
 */
exports.deleteJob = async (jobId, userId, passwordHash) => {
  try {
    const user = await User.findById(userId, { companyId: 1, passwordHash: 1 });
    if (!user) {
      throw new AppError(
        errorCodes.USER_NOT_FOUND.code,
        errorCodes.USER_NOT_FOUND.message,
        errorCodes.USER_NOT_FOUND.status
      );
    }

    const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(
        errorCodes.INCORRECT_PASSWORD.code,
        errorCodes.INCORRECT_PASSWORD.message,
        errorCodes.INCORRECT_PASSWORD.status
      );
    }

  
    const job = await Job.findById(jobId, { companyId: 1 });
    if (!job) {
      throw new AppError(
        errorCodes.NOT_FOUND.code,
        'Job not found.',
        errorCodes.NOT_FOUND.status
      );
    }


    if (user.companyId.toString() !== job.companyId.toString()) {
      throw new AppError(
        errorCodes.FORBIDDEN_ACTION.code,
        '회사 소속이 아닙니다.',
        errorCodes.FORBIDDEN_ACTION.status
      );
    }


    await Job.findByIdAndDelete(jobId);
  } catch (error) {
    throw error;
  }
};


