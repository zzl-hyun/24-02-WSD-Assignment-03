const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/tokenBlacklist');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

/**
 * 토큰 인증
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
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
      console.log("line 31");
      throw new AppError(
        errorCodes.TOKEN_BLACKLISTED.code, 
        errorCodes.TOKEN_BLACKLISTED.message, 
        errorCodes.TOKEN_BLACKLISTED.status);
      }
      
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(
        errorCodes.EXPIRED_TOKEN.code,
        errorCodes.EXPIRED_TOKEN.message,
        errorCodes.EXPIRED_TOKEN.status
      ));
    } else if (error.name === 'JsonWebTokenError') {
      return next(new AppError(
        errorCodes.INVALID_ACCESS_TOKEN.code,
        errorCodes.INVALID_ACCESS_TOKEN.message,
        errorCodes.INVALID_ACCESS_TOKEN.status
      ));
    } else {
      return next(new AppError(error.code, error.message, 500)); // 기타 에러 처리
    }
  }
  
};

module.exports = authenticateToken;
