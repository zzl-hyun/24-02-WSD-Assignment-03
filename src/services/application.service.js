const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');


/**
 * 지원하기
 * @param {ObjectID} userId
 * @param {ObjectID} jobID
 * @param {String} resume
 * @returns 
 */
exports.createApplication = async ({ userId, link, resume }) => {
  try {  const user = await User.findById(userId);
    if (!user) {
      throw new AppError(
        errorCodes.USER_NOT_FOUND.code,
        errorCodes.USER_NOT_FOUND.message,
        errorCodes.USER_NOT_FOUND.status
      );
    }

    const job = await Job.findOne({ link });
    if (!job) {
      throw new AppError(
        errorCodes.JOB_NOT_FOUND.code,
        errorCodes.JOB_NOT_FOUND.message,
        errorCodes.JOB_NOT_FOUND.status
      );
    }

    // 중복지원 체크
    const existingApplication = await Application.findOne({ userId, jobId: job._id });
    if (existingApplication) {
      throw new AppError(
        errorCodes.ALREADY_APPLIED.code,
        errorCodes.ALREADY_APPLIED.message,
        errorCodes.ALREADY_APPLIED.status
      );
    }

    // Use the user's resume if not provided
    const resumeUrl = resume || user.profile.resumeUrl;
    if (!resumeUrl) {
      throw new AppError(
        errorCodes.RESUME_REQUIRED.code,
        errorCodes.RESUME_REQUIRED.message,
        errorCodes.RESUME_REQUIRED.status
      );
    }

    // Save the application
    const application = new Application({ userId, jobId: job._id, resume: resumeUrl });
    return await application.save();
} catch (error) {
    throw new AppError(
      errorCodes.SERVER_ERROR.code,
      error.message || 'An unexpected error occurred.',
      errorCodes.SERVER_ERROR.status
    );
  }
};

/**
 * 지원 내역 조회
 * @param {ObjectID} userId 
 * @param {String} status
 * @returns 
 */
exports.getApplications = async ({ userId, role, status, sortBy = 'appliedAt', sortOrder = 'desc' }) => {
  try {
    const query = {};

    if (role === 'admin') {
      const company = await User.findById(userId, {companyId: 1});
      if (!company) {
          throw new Error('Admin user must be associated with a company.');
      }
      const companyId = company.companyId;

      // Admin: 회사의 모든 Applications 조회
      // 먼저 해당 회사의 jobId들을 가져옴
      const jobIds = await Job.find({ companyId }).select('_id');
      query.jobId = { $in: jobIds.map(job => job._id) };
      console.log(jobIds);
    } else {
        // 일반 사용자: 본인의 Applications만 조회
        query.userId = userId;
    }

    if (status) {
        query.status = status; // 상태 필터 추가
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    return await Application.find(query).sort(sort);
  } catch (error) {
    throw new AppError(
      errorCodes.SERVER_ERROR.code,
      error.message || 'An unexpected error occurred.',
      errorCodes.SERVER_ERROR.status
    );
  }
};


/**
 * 지원 취소
 * @param {ObjectID} applicationId 
 * @param {ObjectID} userId 
 * @returns 
 */
exports.deleteApplication = async ({ applicationId, userId }) => {
  try {    
    const application = await Application.findById(applicationId);

      if (!application) {
          throw new AppError(
            errorCodes.NOT_FOUND.code, 
            'Application not found.', 
            errorCodes.NOT_FOUND.status
          );
      }

      // Check if the user is the owner
      if (!application.userId.equals(userId)) {
          throw new AppError(
            errorCodes.FORBIDDEN_ACTION.code, 
            'You are not authorized to cancel this application.', 
            errorCodes.FORBIDDEN_ACTION.status
          );
      }

      // Check if cancellation is allowed (e.g., status is not 'Accepted' or 'Rejected')
      if (application.status === 'Accepted' || application.status === 'Rejected') {
          throw new AppError(
            errorCodes.FORBIDDEN_ACTION.code, 
            'Application cannot be cancelled at this stage.', 
            errorCodes.FORBIDDEN_ACTION.status
          );
      }

      // Update status to 'Cancelled'
      application.status = 'Cancelled';
      return await application.save();
  } catch (error) {
    throw new AppError(
      errorCodes.SERVER_ERROR.code,
      error.message || 'An unexpected error occurred.',
      errorCodes.SERVER_ERROR.status
    );
  }
};
  
exports.changeStatus = async ({ applicationId, status }) => {
  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new AppError(
        errorCodes.NOT_FOUND.code, 
        'Application not found.', 
        errorCodes.NOT_FOUND.status
      );
    }
    application.status = status;
    return await application.save();
  } catch (error) {
    throw new AppError(
      errorCodes.SERVER_ERROR.code,
      error.message || 'An unexpected error occurred.',
      errorCodes.SERVER_ERROR.status
    );
  }
};
