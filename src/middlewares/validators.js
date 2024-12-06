const Joi = require('joi');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');
const sanitizeInput = (input) => {
  return input.replace(/[\$]/g, '');
};

/**
 * @module validateRegister
 * @description 회원 가입 요청의 데이터를 유효성 검사하는 미들웨어.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} req.body - 회원 가입 데이터를 포함하는 요청 본문
 * @param {string} req.body.username - 사용자 이름 (필수, 공백 불가)
 * @param {string} req.body.email - 사용자 이메일 (필수, 이메일 형식이어야 함)
 * @param {string} req.body.passwordHash - 사용자 비밀번호 (필수, 최소 4자 이상)
 * @param {string} [req.body.role='jobseeker'] - 사용자 역할 (jobseeker 또는 admin 중 하나, 기본값: jobseeker)
 * @param {ObjjectId} req.body.companyId - 소속 회사 ID (admin일 때) 
 * @param {Object} [req.body.profile] - 사용자 프로필 데이터 (선택 사항)
 * @param {string} req.body.profile.fullName - 전체 이름 (필수, 공백 불가)
 * @param {string} [req.body.profile.phoneNumber] - 전화번호 (선택 사항)
 * @param {string} [req.body.profile.bio] - 사용자 소개 (선택 사항)
 * @param {string[]} [req.body.profile.skills] - 기술 목록 (선택 사항)
 * @param {string} [req.body.profile.resumeUrl] - 이력서 URL (선택 사항, URI 형식이어야 함)
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어를 호출하는 콜백 함수
 * 
 * @throws {Object} 400 에러와 유효성 검사 실패 메시지 목록을 반환
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
 *   "code": "ERROR_CODES"
 *   "message": [
 *     "Username is required",
 *     "Invalid email format"
 *   ]
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
    passwordHash: Joi.string().min(4).trim().required().messages({
      'string.min': 'Password must be at least 4 characters long',
      'any.required': 'Password is required',
    }),
    role: Joi.string().valid('jobseeker', 'admin').default('jobseeker').messages({
      'any.only': 'Role must be either jobseeker or admin',
    }),
    companyId: Joi.string()
      .optional()
      .allow(null, '')
      .empty('')
      .default(null)
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
    console.log('validation error');
    throw new AppError(errorCodes.VALIDATION_ERROR.code, errorMessages, errorCodes.VALIDATION_ERROR.status);
  }

  next();
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    passwordHash: Joi.string().min(4).trim().required().messages({
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
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
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

