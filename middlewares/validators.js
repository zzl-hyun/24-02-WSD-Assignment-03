//middleware/validators.js 
// 입력데이터 검증

const Joi = require('joi');
const sanitizeInput = (input) => {
  return input.replace(/[\$]/g, '');
};

// 데이터베이스 작업 시 필터링 적용
// const safeEmail = sanitizeInput(email);
// await User.findOne({ email: safeEmail });

exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().withMessage('Invalid email format'),
    password: Joi.string().min(6).required().withMessage('Password must be at least 6 characters'),
    // 추가하기
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};