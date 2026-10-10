const express = require('express');

const {
  getProfile,
  updateProfile,
  updateSettings
} = require('../controllers/userController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);

router.patch('/profile', updateProfile);

router.patch('/settings', updateSettings);

module.exports = router;