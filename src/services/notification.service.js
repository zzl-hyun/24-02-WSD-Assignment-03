const Notification = require('../models/notification.model');

exports.createNotification = async ({ userId, type, message }) => {
  return await Notification.create({ userId, type, message, isRead: false });
};

exports.getNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 }); // 최신순 정렬
};

exports.markAsRead = async (id) => {
  const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  if (!notification) throw new Error('Notification not found');
};

exports.deleteNotification = async (id) => {
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) throw new Error('Notification not found');
};
