const applicationService = require('../services/application.service');


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

exports.getApplications = async (req, res) => {
    try {
      const { status, sortBy, sortOrder } = req.query;
      const userId = req.user.id; // From authentication middleware
      const role = req.user.role;

      const applications = await applicationService.getApplications({ userId, role, status, sortBy, sortOrder });
      res.status(200).json({ status: 'success', data: applications });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  };

exports.deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.id; // From authentication middleware

    const application = await applicationService.deleteApplication({ applicationId, userId });
    res.status(200).json({ status: 'success', data: application });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
