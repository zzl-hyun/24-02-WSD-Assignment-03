const Notification = require('../models/Notification');
const User = require('../models/User');
const Apperror = require('../utils/AppError')
const errorCodes = require('../config/errorCodes');
const AppError = require('../utils/AppError');

exports.createNotification = async ({ userId, type, message }) => {
  try{
    const existingUser = await User.findById(userId);
    if(!existingUser) throw new AppError(errorCodes.USER_NOT_FOUND.code, errorCodes.USER_NOT_FOUND.message, errorCodes.USER_NOT_FOUND.status);
    
    return await Notification.create({ userId, type, message, isRead: false });
  }catch (error){
    throw error;
  }
};

exports.getNotifications = async (userId, isRead= 'All') => {
  try{
    const filter = { userId };

    if(isRead !== 'All') filter.isRead = isRead;

    return await Notification.find(filter).sort({ createdAt: -1 }); // 최신순 정렬

  }catch (error){
    throw error;
  }
};

exports.markAsRead = async (id) => {
  const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  if (!notification) throw new Error('Notification not found');
};

exports.deleteNotification = async (id) => {
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) throw new Error('Notification not found');
};
