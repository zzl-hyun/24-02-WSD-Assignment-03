// services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../utils/tokenBlacklist');
const User = require('../models/User');
const Company = require('../models/Company');
const Token = require('../models/Token'); // Token 모델 가져오기
const LoginHistory = require('../models/LoginHistory');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');
// 회원 가입
/**
 * 
 * @param {Object} param0 
 * @returns {Promise<Object>}
 */
exports.register = async ({ username, email, passwordHash, role, companyId, profile }) => {
  // 이메일 중복 확인
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
        errorCodes.ALREADY_REGISTERED.code,
        errorCodes.ALREADY_REGISTERED.message,
        errorCodes.ALREADY_REGISTERED.status
    );
  }

  //admin일 경우
  if (role === 'admin'){
    const company = await Company.findById(companyId);
    if (!company){
      throw new AppError(errorCodes.COMPANY_NOT_FOUND.code, errorCodes.COMPANY_NOT_FOUND.message, errorCodes.COMPANY_NOT_FOUND.status);
    }
  }
    
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(passwordHash, 10);

  // 새 사용자 생성
  const newUser = new User({
    username,
    email,
    passwordHash: hashedPassword,
    role: role || 'jobseeker', // 기본값 처리
    companyId: companyId || '',
    profile: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber || '', 
      bio: profile.bio || '', // 기본값 설정
      skills: profile.skills || [], // 빈 배열로 처리
      resumeUrl: profile.resumeUrl || '', // 기본값 설정
    },
  });

  // 데이터 저장
  return await newUser.save();
};

/**
 * 
 * @param {String} email
 * @param {String} passwordHash
 * @param {String} ip
 * @returns accessToken, refreshTOken
 */
exports.login = async ({ email, passwordHash, ip }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS.code,
      errorCodes.INVALID_CREDENTIALS.message,
      errorCodes.INVALID_CREDENTIALS.status
    );
  }

  const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS.code,
      errorCodes.INVALID_CREDENTIALS.message,
      errorCodes.INVALID_CREDENTIALS.status
    );
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Refresh Token 저장 또는 업데이트
  const tokenEntry = await Token.findOne({ user_id: user._id });
  if (tokenEntry) {
    tokenEntry.refresh_token = refreshToken;
    tokenEntry.access_token = accessToken;
    tokenEntry.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 뒤
    await tokenEntry.save();
  } else {
    await Token.create({
      user_id: user._id,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 뒤
    });
  }

  await LoginHistory.create({
    user_id: user._id,
    login_at: Date.now(),
    ip_address: ip,
  });

  return { accessToken, refreshToken };
};


/**
 * 
 * @param {String} refreshToken 
 * @returns accessToken
 */
exports.refreshToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ refresh_token: refreshToken });
  if (!tokenData) {
    throw new AppError(
      errorCodes.INVALID_REFRESH_TOKEN.code,
      errorCodes.INVALID_REFRESH_TOKEN.message,
      errorCodes.INVALID_REFRESH_TOKEN.status
    );
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 이전 Access Token 블랙리스트에 추가
    const previousAccessToken = tokenData.access_token;
    if (previousAccessToken) {
      const expirationTime = jwt.decode(previousAccessToken).exp - Math.floor(Date.now() / 1000);
      console.log('Expiration time for blacklist:', expirationTime);
      await addToBlacklist(previousAccessToken, expirationTime);
    }

    // 새 Access Token 발급
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

      // DB에 새 Access Token 저장
      tokenData.access_token = newAccessToken;
      await tokenData.save();

    return { accessToken: newAccessToken };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(errorCodes.EXPIRED_REFRESH_TOKEN.code, errorCodes.EXPIRED_REFRESH_TOKEN.message, errorCodes.EXPIRED_REFRESH_TOKEN.status);
    }
    throw new AppError(errorCodes.INVALID_REFRESH_TOKEN.code, errorCodes.INVALID_REFRESH_TOKEN.message, errorCodes.INVALID_REFRESH_TOKEN.status);
  }
};

/**
 * 회원 정보 수정
 * @param {ObjectId} userId 
 * @param {Array} profileData 
 * @returns 
 */
exports.updateProfile = async (userId, profileData) => {
  // const filteredProfileData = Object.fromEntries(
  //   Object.entries(profileData).map(([key, value]) => [`profile.${key}`, value])
  // );

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: Object.fromEntries(
        Object.entries(profileData).map(([key, value]) => [`profile.${key}`, value])
      ),
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(
        errorCodes.USER_NOT_FOUND.code,
        errorCodes.USER_NOT_FOUND.message,
        errorCodes.USER_NOT_FOUND.status
    );
  }
  
  return updatedUser.profile;
};

/**
 * 비밀번호 수정
 * @param {String} userId 
 * @param {String} oldPassword 
 * @param {String} newPassword 
 * @description 
 * 
 */
exports.updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
        errorCodes.USER_NOT_FOUND.code,
        errorCodes.USER_NOT_FOUND.message,
        errorCodes.USER_NOT_FOUND.status
    );
  }


  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isOldPasswordValid) {
    throw new AppError(
      errorCodes.INCORRECT_OLD_PASSWORD.code, 
      errorCodes.INCORRECT_OLD_PASSWORD.message, 
      errorCodes.INCORRECT_OLD_PASSWORD.status
    );
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
};

/**
 * 회원 탈퇴
 * @param {ObjectId} userId 
 * @param {String} passwordHash 
 */
exports.deleteProfile = async (userId, passwordHash) => {
  // 사용자가 존재하는지 확인
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(errorCodes.USER_NOT_FOUND.code, errorCodes.USER_NOT_FOUND.message, errorCodes.USER_NOT_FOUND.status);
  }

  const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(
      errorCodes.INCORRECT_PASSWORD.code, 
      errorCodes.INCORRECT_PASSWORD.message, 
      errorCodes.INCORRECT_PASSWORD.status
    );
  }

  // 사용자가 존재하면 삭제
  await User.findByIdAndDelete(userId);
};

exports.logout = async (refreshToken) => {
  const token = await Token.findOne({ refresh_token: refreshToken });

  if (!token) {
    throw new AppError(
      errorCodes.TOKEN_NOT_FOUND.code,
      'Refresh token not found',
      errorCodes.TOKEN_NOT_FOUND.status
    );
  }

  // Refresh token 삭제
  await Token.deleteOne({ refresh_token: refreshToken });
};
