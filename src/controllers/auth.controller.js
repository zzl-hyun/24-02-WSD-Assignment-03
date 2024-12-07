const authService = require('../services/auth.service');
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
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

    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error)
  }
};

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

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken; // 쿠키에서 Refresh Token 읽기
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token is missing' });
    }

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.status(200).json({ status: 'success', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async(req, res, next) => {
  try {
    const userId = req.user.id;

    const { username, email, role, companyId, profile } = await authService.getProfile(userId);

    res.status(200).json({status: 'success', data: { username, email, role, companyId, profile }});
  } catch (error){
    netx(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, bio, skills, resumeUrl, oldPassword, newPassword } = req.body;
    
    if (oldPassword && newPassword) {
      await authService.updatePassword(req.user.id, oldPassword, newPassword);
    }
    
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

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken; // 쿠키에서 Refresh Token 읽기
    if (!refreshToken) {
      return res.status(400).json({ message: 'No Refresh Token provided' });
    }

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


