// services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token'); // Token 모델 가져오기
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');
// 회원 가입
/**
 * 
 * @param {Object} param0 
 * @returns {Promise<Object>}
 */
exports.register = async ({ username, email, passwordHash, role, profile }) => {
  // 이메일 중복 확인
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email is already registered.');

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(passwordHash, 10);

  // 새 사용자 생성
  const newUser = new User({
    username,
    email,
    passwordHash: hashedPassword,
    role: role || 'jobseeker', // 기본값 처리
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

// 로그인
exports.login = async ({ email, passwordHash }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS.code,
      errorCodes.INVALID_CREDENTIALS.message,
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS.code,
      errorCodes.INVALID_CREDENTIALS.message,
      401
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

  // Refresh Token 저장
  await Token.create({
    user_id: user._id,
    refresh_token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 뒤
  });

  return { accessToken, refreshToken };
};


// 토큰 갱신
exports.refreshToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ refresh_token: refreshToken });
  if (!tokenData) throw new Error('Invalid refresh token.');

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

  return { accessToken: newAccessToken };
};

// 프로필 수정
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

  if (!updatedUser) throw new Error('User not found.');
  return updatedUser.profile;
};

exports.updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isOldPasswordValid) throw new Error('Old password is incorrect.');

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hashedNewPassword;
  await user.save();
};


