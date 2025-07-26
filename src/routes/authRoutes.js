const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const router = express.Router();

// Register new user
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Admin', 'Mentor', 'Mentee']).withMessage('Role must be Admin, Mentor, or Mentee'),
  handleValidation
], registerUser);
// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
], loginUser);
// Get current user info (protected)
router.get('/me', authenticate, getMe);

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  handleValidation
], forgotPassword);
// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
], resetPassword);

module.exports = router;
