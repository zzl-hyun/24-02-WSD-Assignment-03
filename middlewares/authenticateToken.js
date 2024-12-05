const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/tokenBlacklist');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    // Authorization 헤더가 없거나 잘못된 형식인 경우
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        errorCodes.MISSING_TOKEN.code,
        errorCodes.MISSING_TOKEN.message,
        errorCodes.MISSING_TOKEN.status
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError(
        errorCodes.INVALID_TOKEN_FORMAT.code,
        errorCodes.INVALID_TOKEN_FORMAT.message,
        errorCodes.INVALID_TOKEN_FORMAT.status
      );
    }

    // 블랙리스트 확인
    const blacklisted = await isBlacklisted(token);
    if (blacklisted) {
      throw new AppError('TOKEN_BLACKLISTED', 'Access token is invalid', 403);
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    // JWT 에러 처리
    if (error.name === 'TokenExpiredError') {
      next(
        new AppError(
          errorCodes.EXPIRED_TOKEN.code,
          errorCodes.EXPIRED_TOKEN.message,
          errorCodes.EXPIRED_TOKEN.status
        )
      );
    } else if (error.name === 'JsonWebTokenError') {
      next(
        new AppError(
          errorCodes.INVALID_ACCESS_TOKEN.code,
          errorCodes.INVALID_ACCESS_TOKEN.message,
          errorCodes.INVALID_ACCESS_TOKEN.status
        )
      );
    } else if (error instanceof AppError) {
      next(error); // AppError는 그대로 전달
    } else {
      next(new AppError(error.code, error.message, 500));
    }
  }
};

module.exports = authenticateToken;
