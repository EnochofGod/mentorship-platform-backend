const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Mentor sets availability
const { body } = require('express-validator');
const handleValidation = require('../middleware/validationMiddleware');

router.post('/', [
  authenticate,
  authorize(['Mentor']),
  body('day').isString().withMessage('Day is required'),
  body('startTime').isString().withMessage('Start time is required'),
  body('endTime').isString().withMessage('End time is required'),
  handleValidation
], availabilityController.setAvailability);
// Mentor views own availability
router.get('/me', authenticate, authorize(['Mentor']), availabilityController.getMyAvailability);
// Mentee views mentor's availability
router.get('/:mentorId', authenticate, authorize(['Mentee']), availabilityController.getMentorAvailability);

module.exports = router;
