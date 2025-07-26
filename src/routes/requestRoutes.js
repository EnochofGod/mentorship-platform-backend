const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Mentee sends mentorship request
const { body, param } = require('express-validator');
const handleValidation = require('../middleware/validationMiddleware');

router.post('/', [
  authenticate,
  authorize(['Mentee']),
  body('mentorId').isInt().withMessage('mentorId must be an integer'),
  body('message').optional().isString().isLength({ max: 500 }).withMessage('Message must be under 500 characters'),
  handleValidation
], requestController.createRequest);
// Mentee views sent requests
router.get('/sent', authenticate, authorize(['Mentee']), requestController.getSentRequests);
// Mentor views received requests
router.get('/received', authenticate, authorize(['Mentor']), requestController.getReceivedRequests);
// Mentor updates request status
router.put('/:id', [
  authenticate,
  authorize(['Mentor']),
  param('id').isInt().withMessage('Request ID must be an integer'),
  body('status').isIn(['ACCEPTED', 'REJECTED']).withMessage('Status must be ACCEPTED or REJECTED'),
  handleValidation
], requestController.updateRequestStatus);

module.exports = router;
