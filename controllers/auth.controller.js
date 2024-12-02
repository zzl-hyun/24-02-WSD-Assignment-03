const authService = require('../services/auth.service');

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      passwordHash, // 요청 필드 이름과 맞춤
      role,
      profile: { fullName, phoneNumber, bio, skills, resumeUrl } = {}, // profile 내부 파싱
    } = req.body;

    // 필요한 필드를 service로 전달
    const result = await authService.register({
      username,
      email,
      passwordHash,
      role,
      profile: { fullName, phoneNumber, bio, skills, resumeUrl },
    });

    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, passwordHash } = req.body;
    const tokens = await authService.login({ email, passwordHash });
    res.status(200).json({ status: 'success', data: tokens });
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
};


// 토큰 갱신
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const newTokens = await authService.refreshToken(refreshToken);
    res.status(200).json({ status: 'success', data: newTokens });
  } catch (error) {
    res.status(403).json({ status: 'error', message: error.message });
  }
};

// 프로필 수정
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, bio, skills, resumeUrl, oldPassword, newPassword } = req.body;

    if (fullName || phoneNumber || bio || skills || resumeUrl) {
      await authService.updateProfile(req.user.id, {
        fullName,
        phoneNumber,
        bio,
        skills,
        resumeUrl,
      });
    }

    if (oldPassword && newPassword) {
      await authService.updatePassword(req.user.id, oldPassword, newPassword);
    }

    res.status(200).json({ status: 'success', message: 'Profile and/or password updated successfully.' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};