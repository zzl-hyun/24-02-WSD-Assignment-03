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
  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
      errorCodes.USER_NOT_FOUND.code,
      errorCodes.USER_NOT_FOUND.message,
      errorCodes.USER_NOT_FOUND.status
    );
  }

  // Fetch the job using the provided link
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
};


/**
 * 
 * @param {*} param0 
 * @returns 
 */
exports.getApplications = async ({ userId, status, sortBy = 'appliedAt', sortOrder = 'desc' }) => {
    const query = { userId };
  
    if (status) {
      query.status = status;
    }
  
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  
    return await Application.find(query).sort(sort).populate('jobId');
};

/**
 * 
 * @param {*} param0 
 * @returns 
 */
exports.deleteApplication = async ({ applicationId, userId }) => {
    // Find the application
    const application = await Application.findById(applicationId);

    if (!application) {
        throw new Error('Application not found.');
    }

    // Check if the user is the owner
    if (!application.userId.equals(userId)) {
        throw new Error('You are not authorized to cancel this application.');
    }

    // Check if cancellation is allowed (e.g., status is not 'Accepted' or 'Rejected')
    if (application.status === 'Accepted' || application.status === 'Rejected') {
        throw new Error('Application cannot be cancelled at this stage.');
    }

    // Update status to 'Cancelled'
    application.status = 'Cancelled';
    return await application.save();
};
  