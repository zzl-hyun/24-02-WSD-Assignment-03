const Joi = require('joi');
const sanitizeInput = (input) => {
  return input.replace(/[\$]/g, '');
};

// 회원 가입 유효성 검사
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
    profile: Joi.object({
      fullName: Joi.string().trim().required().messages({
        'string.empty': 'Full name is required',
      }),
      phoneNumber: Joi.string().trim().optional(),
      bio: Joi.string().trim().optional(),
      skills: Joi.array().items(Joi.string().trim()).optional(),
      resumeUrl: Joi.string().uri().trim().optional(),
    }).optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // 에러 메시지를 배열로 변환
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ status: 'error', errors: errorMessages });
  }

  next();
};
