const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Book a session (mentee)
const { body, param } = require('express-validator');
const handleValidation = require('../middleware/validationMiddleware');

router.post('/', [
  authenticate,
  authorize(['Mentee']),
  body('mentorId').isInt().withMessage('mentorId must be an integer'),
  body('scheduledTime').isISO8601().withMessage('scheduledTime must be a valid date'),
  body('requestId').isInt().withMessage('requestId must be an integer'),
  handleValidation
], sessionController.bookSession);
// Mentor views sessions
router.get('/mentor', authenticate, authorize(['Mentor']), sessionController.getMentorSessions);
// Mentee views sessions
router.get('/mentee', authenticate, authorize(['Mentee']), sessionController.getMenteeSessions);
// Submit feedback
router.put('/:id/feedback', [
  authenticate,
  param('id').isInt().withMessage('Session ID must be an integer'),
  body('role').isIn(['Mentee', 'Mentor']).withMessage('Role must be Mentee or Mentor'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('feedback').optional().isString().isLength({ max: 1000 }).withMessage('Feedback must be under 1000 characters'),
  handleValidation
], sessionController.submitFeedback);

module.exports = router;
