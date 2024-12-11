const applicationService = require('../services/application.service');

/**
 * 공고 지원
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.createApplication = async (req, res, next) => {
  try {
    const { link, resume } = req.body;
    const userId = req.user.id; // 인증 확인 from /middleware/authenticateToken

    const application = await applicationService.createApplication({ userId, link, resume });
    res.status(201).json({ status: 'success', data: application });
  } catch (error) {
    next(error);
  }
};

/**
 * 지원서 조회
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.getApplications = async (req, res, next) => {
    try {
      const { status, sortBy, sortOrder } = req.query;
      const userId = req.user.id; // From authentication middleware
      const role = req.user.role;

      const applications = await applicationService.getApplications({ userId, role, status, sortBy, sortOrder });
      res.status(200).json({ status: 'success', data: applications });
    } catch (error) {
      next(error);
    }
  };

/**
 * 지원 취소
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.deleteApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.id; // From authentication middleware

    const application = await applicationService.deleteApplication({ applicationId, userId });
    res.status(200).json({ status: 'success', data: application });
  } catch (error) {
    next(error);
  }
};

/**
 * 지원서 상태 변경
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.changeStatus = async (req, res, next) => {
  try{
    const applicationId = req.params.id;
    const status   = req.query.status;

    const application = await applicationService.changeStatus({ applicationId, status });
    res.status(200).json({ status: 'success', data: application});
  } catch(error){
    next(error);
  }
};