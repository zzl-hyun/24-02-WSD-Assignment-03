const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');
const { createNotification } = require('./notification.service');


/**
 * 지원하기
 * @param {ObjectID} userId
 * @param {ObjectID} jobID
 * @param {String} resume
 * @returns {Promise<Object>} 생성한 지원서
 */
exports.createApplication = async ({ userId, link, resume }) => {
  try {  
    // 사용자 확인
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(
        errorCodes.USER_NOT_FOUND.code,
        errorCodes.USER_NOT_FOUND.message,
        errorCodes.USER_NOT_FOUND.status
      );
    }

    // 공고 확인
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

    // 이력서 체크
    const resumeUrl = resume || user.profile.resumeUrl;
    if (!resumeUrl) {
      throw new AppError(
        errorCodes.RESUME_REQUIRED.code,
        errorCodes.RESUME_REQUIRED.message,
        errorCodes.RESUME_REQUIRED.status
      );
    }

    // 지원서 생성
    const application = new Application({ userId, jobId: job._id, resume: resumeUrl });
    return await application.save();
} catch (error) {
    throw error;
  }
};

/**
 * 지원 내역 조회
 * @param {Object} params
 * @param {string} params.userId 
 * @param {String} params.Status
 * @param {string} params.status
 * @param {string} params.sortBy
 * @param {string} params.sortOrder
 * @returns {Promise<Object>} 지원서 리스트
 */
exports.getApplications = async ({ userId, role, status = 'All', sortBy = 'appliedAt', sortOrder = 'desc' }) => {
  try {
    const query = {};
    // 관리자 역할: 회사 지원서 조회
    if (role === 'admin') {
      const company = await User.findById(userId, {companyId: 1});
      if (!company) {
          throw new AppError(errorCodes.COMPANY_NOT_FOUND.code, 'Admin user must be associated with a company.', errorCodes.COMPANY_NOT_FOUND.status);
      }
      const companyId = company.companyId;

      // Admin: 소속 회사의 모든 지원서 조회
      // 회사가 공고한 jobId들을 가져옴
      const jobIds = await Job.find({ companyId }).select('_id');
      query.jobId = { $in: jobIds.map(job => job._id) };
      // console.log(jobIds);
    } 
    // 일반 사용자: 본인 지원서만 조회
    else {
      query.userId = userId;
    }

    if (status && status !== 'All') {
        query.status = status; // 상태 필터 추가
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    return await Application.find(query).sort(sort);
  } catch (error) {
    throw error;
  }
};


/**
 * 지원 취소
 * @param {ObjectID} applicationId 
 * @param {ObjectID} userId 
 * @@returns {Promise<Object>} 취소된 지원서 
 */
exports.deleteApplication = async ({ applicationId, userId }) => {
  try {    
    // 지원서 확인
    const application = await Application.findById(applicationId);
    if (!application) {
        throw new AppError(
          errorCodes.NOT_FOUND.code, 
          'Application not found.', 
          errorCodes.NOT_FOUND.status
        );
    }

    // 권한 확인
    if (!application.userId.equals(userId)) {
        throw new AppError(
          errorCodes.FORBIDDEN_ACTION.code, 
          'You are not authorized to cancel this application.', 
          errorCodes.FORBIDDEN_ACTION.status
        );
    }

    // 취소 가능상태 확인
    if (application.status === 'Accepted' || application.status === 'Rejected') {
        throw new AppError(
          errorCodes.FORBIDDEN_ACTION.code, 
          'Application cannot be cancelled at this stage.', 
          errorCodes.FORBIDDEN_ACTION.status
        );
    }

    // 상태를 'Cancelled'로 업데이트
    application.status = 'Cancelled';
    return await application.save();
  } catch (error) {
    throw error;
  }
};
  
/**
 * 
 * @param {Object} params
 * @param {ObjectId} params.applicationId
 * @param {status} params.status
 * @returns {Promise<Object>} 업데이트 지원서
 */
exports.changeStatus = async ({ applicationId, status }) => {
  try {
    // 지원서 확인
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new AppError(
        errorCodes.NOT_FOUND.code, 
        'Application not found.', 
        errorCodes.NOT_FOUND.status
      );
    }

    // 상태 업데이트
    application.status = status;

    // 알림 생성
    await createNotification({
      userId: application.userId, 
      type: 'user', 
      message:`your Application has been ${status}`
    });

    return await application.save();
  } catch (error) {
    throw error;
  }
};
