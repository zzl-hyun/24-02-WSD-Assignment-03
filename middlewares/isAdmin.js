const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

const isAdmin = (req, res, next) => {
  // 인증된 사용자가 `req.user`에 담겨 있으므로, 역할(role)을 확인
  if (req.user && req.user.role === 'admin') {
    return next(); 
  }

  throw new AppError(errorCodes.FORBIDDEN_ACTION.code, errorCodes.FORBIDDEN_ACTION.message, errorCodes.FORBIDDEN_ACTION.status);
};

module.exports = isAdmin;
