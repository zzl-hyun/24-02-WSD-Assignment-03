// JWT 인증
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(errorCodes.MISSING_TOKEN.code, errorCodes.MISSING_TOKEN.message, errorCodes.MISSING_TOKEN.status);
  }
  const token = authHeader.split(' ')[1];
  if (!token) throw new AppError(errorCodes.INVALID_TOKEN_FORMAT.code, errorCodes.INVALID_TOKEN_FORMAT.message, errorCodes.INVALID_TOKEN_FORMAT.status);
  // res.status(401).json({ message: 'Invalid token format.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // 디코딩된 사용자 정보 추가
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(errorCodes.EXPIRED_TOKEN.code, errorCodes.EXPIRED_TOKEN.message, errorCodes.EXPIRED_TOKEN.status);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError(errorCodes.INVALID_ACCESS_TOKEN.code, errorCodes.INVALID_ACCESS_TOKEN.message, errorCodes.INVALID_ACCESS_TOKEN.status);
    } else {
      return res.status(403).json({ message: 'Authentication failed.' });
    }
  }
};

module.exports = authenticateToken;
