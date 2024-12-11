const Joi = require('joi');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');
const sanitizeInput = (input) => {
  return input.replace(/[\$]/g, '');
};

/**
 * @module validateRegister
 * @description 회원 가입 요청의 데이터를 유효성 검사하는 미들웨어.
 * 
 * @param {Object} req - 요청 
 * @param {Object} res - 응답
 * @param {Function} next - 다음 미들웨어를 호출
 * 
 * @throws {Object} 422 에러와 유효성 검사 실패 메시지 목록을 반환
 * 
 * @example
 * // 클라이언트 요청 본문 예시
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "passwordHash": "securepassword",
 *   "role": "jobseeker",
 *   "profile": {
 *     "fullName": "John Doe",
 *     "phoneNumber": "123-456-7890",
 *     "bio": "A passionate developer",
 *     "skills": ["JavaScript", "React"],
 *     "resumeUrl": "http://example.com/resume.pdf"
 *   }
 * }
 * 
 * @example
 * // 에러 응답 예시
 * {
 *   "status": "error",
 *   "code": "VALIDATION_ERROR"
 *   "message": "Invalid email format"
 *   
 * }
 */
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().trim().required().messages({
      'string.empty': 'Username is required',
    }),
    email: Joi.string().email().trim().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(4).trim().required().messages({
      'string.min': 'Password must be at least 4 characters long',
      'any.required': 'Password is required',
    }),
    role: Joi.string().valid('jobseeker', 'admin').default('jobseeker').messages({
      'any.only': 'Role must be either jobseeker or admin',
    }),
    companyId: Joi.string().optional().allow(null, '').empty('').default(null)
      .when('role', {
        is: 'admin',
        then: Joi.required().messages({
          'any.required': 'Company ID is required for admin role',
        }),
      }),
    profile: Joi.object({
      fullName: Joi.string().trim().required().messages({
        'string.empty': 'Full name is required',
      }),
      phoneNumber: Joi.string().trim().required(),
      bio: Joi.string().trim().optional(),
      skills: Joi.array().items(Joi.string().trim()).optional(),
      resumeUrl: Joi.string().uri().trim().optional(),
    }).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new AppError(errorCodes.VALIDATION_ERROR.code, errorMessages, errorCodes.VALIDATION_ERROR.status);
  }

  next();
};

/**
 * 로그인 유효성 검사
 * @param {Object} req - 요청 
 * @param {Object} res - 응답
 * @param {Function} next - 다음 미들웨어를 호출
 * 
 * @throws {Object} 422 에러와 유효성 검사 실패 메시지 목록을 반환
 */
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(4).trim().required().messages({
      'string.min': 'Password must be at least 4 characters long',
      'any.required': 'Password is required',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false});
  if (error){
    const errorMessages = error.details.map((detail) => detail.message);
    throw new AppError(errorCodes.VALIDATION_ERROR.code, errorMessages, errorCodes.VALIDATION_ERROR.status);
  }

  next();
}

/**
 * 프로필 유효성 검사
 * @param {Object} req - 요청 
 * @param {Object} res - 응답
 * @param {Function} next - 다음 미들웨어를 호출
 * 
 * @throws {Object} 422 에러와 유효성 검사 실패 메시지 목록을 반환
 */
exports.validateProfileUpdate = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().trim().optional(),
    phoneNumber: Joi.string().trim().optional(),
    bio: Joi.string().trim().optional(),
    skills: Joi.array().items(Joi.string().trim()).optional(),
    resumeUrl: Joi.string().uri().optional(),
    oldPassword: Joi.string().min(4).optional(),
    newPassword: Joi.string().min(6).optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error){
    const errorMessages = error.details.map((detail) => detail.message);
    throw new AppError(errorCodes.VALIDATION_ERROR.code, errorMessages, errorCodes.VALIDATION_ERROR.status);
  }

  if ((req.body.oldPassword && !req.body.newPassword) || (!req.body.oldPassword && req.body.newPassword)) {
    throw new AppError(errorCodes.MISSING_FIELDS.code, 'Both oldPassword and newPassword must be provided for password update.', errorCodes.MISSING_FIELDS.status);
  }

  next();
}
/**
 * ID 유효성 검사
 * @param {Object} req - 요청 
 * @param {Object} res - 응답
 * @param {Function} next - 다음 미들웨어를 호출
 * 
 * @throws {Object} 422 에러와 유효성 검사 실패 메시지 목록을 반환
 */
exports.validateID = (req, res, next) => {
  const id  = req.params.id || req.body.job_id;
  if (!id) {
    // ID가 제공되지 않은 경우 처리
    throw new AppError(
      errorCodes.VALIDATION_ERROR.code,
      'ID  required.',
      errorCodes.VALIDATION_ERROR.status
    );
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(errorCodes.VALIDATION_ERROR.code, 'Invalid Job ID format. It must be a valid MongoDB ObjectId.', errorCodes.VALIDATION_ERROR.status);
  }
  else next();
};

/**
 * 상태 유효성 검사
 * @param {Object} req - 요청 
 * @param {Object} res - 응답
 * @param {Function} next - 다음 미들웨어를 호출
 * 
 * @throws {Object} 422 에러와 유효성 검사 실패 메시지 목록을 반환
 */
exports.validateStatus = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().trim().required().valid('Accepted', 'Rejected').messages({
      'string.empty': 'Status cannot be empty',
      'any.only': 'Status must be either Accepted or Rejected',
    }),
  });

  const { error } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new AppError(errorCodes.VALIDATION_ERROR.code, errorMessages, errorCodes.VALIDATION_ERROR.status);
  }
  next();
};

/**
 * 링크 유효성 검사
 * @param {Object} req - 요청 
 * @param {Object} res - 응답
 * @param {Function} next - 다음 미들웨어를 호출
 * 
 * @throws {Object} 422 에러와 유효성 검사 실패 메시지 목록을 반환
 */
exports.validateLink = (req, res, next) => {
  const link  = req.body.link;
  if (!link) {
    // link 제공되지 않은 경우 처리
    throw new AppError(
      errorCodes.VALIDATION_ERROR.code,
      'link  required.',
      errorCodes.VALIDATION_ERROR.status
    );
  }
  else next();
};
