const express = require('express');

const {
  createAlert,
  getActiveAlert,
  getAlertHistory,
  getAlertById,
  updateAlertLocation,
  getAlertLocationHistory
} = require('../controllers/alertController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Create a new SOS alert
router.post('/', createAlert);

// Get current user's active alert
router.get('/active', getActiveAlert);

// Get current user's alert history
router.get('/history', getAlertHistory);

// Update location for current user's active alert
router.post('/:id/location', updateAlertLocation);

// Get location history for current user's alert
router.get('/:id/location', getAlertLocationHistory);

// Get current user's alert details
router.get('/:id', getAlertById);

module.exports = router;