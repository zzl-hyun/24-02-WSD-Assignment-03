const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken');
const {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
} = require('../../controllers/notification.controller');


/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 알림 관리 API
 */
router.post('/create', createNotification);

router.get('/', authenticateToken, getNotifications);

router.patch('/:id/read', markAsRead);

router.delete('/:id', deleteNotification);

module.exports = router;
