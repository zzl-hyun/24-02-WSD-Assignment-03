const Notification = require('../models/Notification');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const errorCodes = require('../config/errorCodes');

/**
 * 알림 생성
 * @param {ObjectId} userId
 * @param {String} type
 * @param {String} message 
 * @returns 
 */
exports.createNotification = async ({ userId, type, message }) => {
  try{
    const existingUser = await User.findById(userId);
    if(!existingUser) throw new AppError(errorCodes.USER_NOT_FOUND.code, errorCodes.USER_NOT_FOUND.message, errorCodes.USER_NOT_FOUND.status);
    
    return await Notification.create({ userId, type, message, isRead: false });
  }catch (error){
    throw error;
  }
};

/**
 * 알림 목록 조회
 * @param {ObjectId} userId 
 * @param {String} isRead 
 * @returns 
 */
exports.getNotifications = async (userId, isRead= 'All') => {
  try{
    const filter = { userId };

    if(isRead !== 'All') filter.isRead = isRead;

    return await Notification.find(filter).sort({ createdAt: -1 }); // 최신순 정렬

  }catch (error){
    throw error;
  }
};

/**
 * 알림 읽음
 * @param {ObjectId} id 
 */
exports.markAsRead = async (id) => {
  const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  if (!notification) throw new AppError(errorCodes.NOT_FOUND.code, 'Notification not found', errorCodes.NOT_FOUND.status);
};

/**
 * 알림 제거
 * @param {ObjectId} id 
 */
exports.deleteNotification = async (id) => {
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) throw new AppError(errorCodes.NOT_FOUND.code, 'Notification not found', errorCodes.NOT_FOUND.status);
};
