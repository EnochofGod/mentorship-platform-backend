const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Only Admins
router.use(authenticate, authorize(['Admin']));

router.get('/users', adminController.getAllUsers);
const { body, param } = require('express-validator');
const handleValidation = require('../middleware/validationMiddleware');

router.put('/users/:id/role', [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('role').isIn(['Admin', 'Mentor', 'Mentee']).withMessage('Role must be Admin, Mentor, or Mentee'),
  handleValidation
], adminController.updateUserRole);
router.get('/matches', adminController.getAllMatches);
router.get('/sessions', adminController.getAllSessions);
router.post('/assign', [
  body('mentorId').isInt().withMessage('mentorId must be an integer'),
  body('menteeId').isInt().withMessage('menteeId must be an integer'),
  handleValidation
], adminController.assignMentorToMentee);

module.exports = router;
