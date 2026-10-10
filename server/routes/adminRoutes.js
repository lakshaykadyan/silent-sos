const express = require('express');

const {
  getAdminDashboard,
  getAdminAlerts,
  getActiveAdminAlerts,
  getAdminAlertById,
  getAdminUsers,
  acknowledgeAdminAlert,
  resolveAdminAlert
} = require('../controllers/adminController');

const protect = require('../middleware/authMiddleware');

const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.use(adminOnly);

// Admin dashboard
router.get('/dashboard', getAdminDashboard);

// Alert management
router.get('/alerts/active', getActiveAdminAlerts);

router.get('/alerts', getAdminAlerts);

router.get('/alerts/:id', getAdminAlertById);

router.post('/alerts/:id/acknowledge', acknowledgeAdminAlert);

router.post('/alerts/:id/resolve', resolveAdminAlert);

// User management
router.get('/users', getAdminUsers);

module.exports = router;