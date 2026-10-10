const express = require('express');

const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');

const protect = require('../middleware/authMiddleware');
const {
  authRateLimiter
} = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/register', authRateLimiter, register);

router.post('/login', authRateLimiter, login);

router.get('/me', protect, getMe);

router.post('/logout', protect, logout);

module.exports = router;