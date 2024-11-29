// services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token'); // Token 모델 가져오기

// 회원 가입
exports.register = async ({ username, email, password, profile }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email is already registered.');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    passwordHash: hashedPassword,
    profile,
  });
  return await newUser.save();
};

// 로그인
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password.');

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) throw new Error('Invalid email or password.');

  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  await Token.create({ user_id: user._id, access_token: accessToken, refresh_token: refreshToken });

  return { accessToken, refreshToken };
};

// 토큰 갱신
exports.refreshToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ refresh_token: refreshToken });
  if (!tokenData) throw new Error('Invalid refresh token.');

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

  return { accessToken: newAccessToken };
};

// 프로필 수정
exports.updateProfile = async (userId, profileData) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profile: profileData },
    { new: true }
  );
  return updatedUser.profile;
};
