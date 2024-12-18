const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken');
const {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
} = require('../../controllers/notification.controller');
const isAdmin = require('../../middlewares/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 알림 관리 API
 */
router.post('/create', authenticateToken, isAdmin, createNotification);

router.get('/', authenticateToken, getNotifications);

router.patch('/:id/read', authenticateToken, markAsRead);

router.delete('/:id', authenticateToken, deleteNotification);

module.exports = router;
