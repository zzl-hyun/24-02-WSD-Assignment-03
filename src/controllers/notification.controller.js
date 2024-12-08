const notificationService = require('../services/notification.service');

exports.createNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;
    const notification = await notificationService.createNotification({ userId, type, message });
    res.status(201).json({ status: 'success', data: notification });
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id; // 사용자 ID는 인증 미들웨어에서 제공된다고 가정
    const isRead = req.query.read;
    const notifications = await notificationService.getNotifications(userId, isRead);
    res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await notificationService.markAsRead(id);
    res.status(200).json({ status: 'success', message: 'Notification marked as read.' });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id);
    res.status(200).json({ status: 'success', message: 'Notification deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
