const express = require('express');

const {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require('../controllers/notificationController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadNotifications);
router.patch('/read-all', markAllNotificationsAsRead);
router.patch('/:id/read', markNotificationAsRead);

module.exports = router;