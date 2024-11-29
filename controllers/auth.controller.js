const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
      const { username, email, password, fullName, phoneNumber } = req.body;
      const result = await authService.register({
        username,
        email,
        password,
        profile: { fullName, phoneNumber },
      });
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  };


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login({ email, password });
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
    const { fullName, phoneNumber, bio, skills, resumeUrl } = req.body;
    const updatedProfile = await authService.updateProfile(req.user.id, {
      fullName,
      phoneNumber,
      bio,
      skills,
      resumeUrl,
    });
    res.status(200).json({ status: 'success', data: updatedProfile });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
