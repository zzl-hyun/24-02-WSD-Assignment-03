const authService = require('../services/auth.service');
const AppError = require('../utils/AppError')
const errorCodes = require('../config/errorCodes');

/**
 * 회원가입
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password, 
      role,
      companyId,
      profile: { fullName, phoneNumber, bio, skills, resumeUrl } = {}, 
    } = req.body;

    // console.log(req.body);
    // 필요한 필드를 service로 전달
    const result = await authService.register({
      username,
      email,
      password,
      role,
      companyId,
      profile: { fullName, phoneNumber, bio, skills, resumeUrl },
    });
  
    res.status(201).json({ status: 'success', data: { 
      username: result.username, 
      email: result.email, 
      role: result.role, 
      companyId: result.companyId,
      profile: result.profile,
    } });
  } catch (error) {
    next(error)
  }
};

/**
 * 로그인
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;

    const { accessToken, refreshToken } = await authService.login({ email, password, ip,});
    // Refresh Token을 쿠키에 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1일
    });

    res.status(200).json({ status: 'success', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

/**
 * 토큰 갱신
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.refreshToken = async (req, res, next) => {
  try {
    // 쿠키에서 Refresh Token 읽기
    const refreshToken = req.cookies.refreshToken; 
    if (!refreshToken) {
      // return res.status(401).json({ message: 'Refresh Token is missing' });
      return next(new AppError(errorCodes.MISSING_TOKEN.code, 'Refresh Token is missing', errorCodes.MISSING_TOKEN.status));
    }

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.status(200).json({ status: 'success', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

/**
 * 프로필 조회
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.getProfile = async(req, res, next) => {
  try {
    const userId = req.user.id;

    const { username, email, role, companyId, profile } = await authService.getProfile(userId);

    res.status(200).json({status: 'success', data: { username, email, role, companyId, profile }});
  } catch (error){
    netx(error);
  }
};

/**
 * 프로필 업데이트
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, bio, skills, resumeUrl, oldPassword, newPassword } = req.body;
    
    // 비밀번호 변경
    if (oldPassword && newPassword) {
      await authService.updatePassword(req.user.id, oldPassword, newPassword);
    }
    
    // 프로필 업데이트
    if (fullName || phoneNumber || bio || skills || resumeUrl) {
      await authService.updateProfile(req.user.id, {
        fullName,
        phoneNumber,
        bio,
        skills,
        resumeUrl,
      });
    }

    res.status(200).json({ status: 'success', message: 'Profile and/or password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * 회원 탈퇴
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.deleteProfile = async (req, res, next) => {
  try{
    const userId = req.user.id;
    const { password } = req.body;

    await authService.deleteProfile(userId, password);

    res.status(200).json({ status: 'success', message: 'Profile deleted successfully' });

  } catch (err) {
    next(err);
  }
}

/**
 * 로그아웃
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken; // 쿠키에서 Refresh Token 읽기
    if (!refreshToken) {
      return next(new AppError(errorCodes.MISSING_TOKEN.code, 'Refresh Token is missing', errorCodes.MISSING_TOKEN.status));
    }

    // 로그아웃 처리
    await authService.logout(refreshToken);

    // Refresh Token 쿠키 삭제
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ status: 'success', message: 'Successfully logged out' });
  } catch (err) {
    next(err);
  }
};


