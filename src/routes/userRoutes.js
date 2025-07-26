const express = require('express');
const { updateMyProfile, getMyProfile, getMentors, getUserById } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();


// Public mentors directory
router.get('/mentors', getMentors);

router.get('/me', authenticate, getMyProfile);
const { body } = require('express-validator');
const handleValidation = require('../middleware/validationMiddleware');

router.put('/me/profile', [
  authenticate,
  body('name').optional().isString().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('bio').optional().isString().isLength({ min: 10 }).withMessage('Bio must be at least 10 characters'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('goals').optional().isString().isLength({ min: 5 }).withMessage('Goals must be at least 5 characters'),
  body('industry').optional().isIn([
    'Software Development',
    'Information Technology (IT) Services',
    'Cybersecurity',
    'Artificial Intelligence / Machine Learning',
    'Data Science / Analytics',
    'Cloud Computing',
    'Web Development',
    'Mobile App Development',
    'Fintech (Financial Technology)',
    'Healthtech (Healthcare Technology)',
    'Edtech (Education Technology)',
    'E-commerce',
    'Blockchain / Cryptocurrency',
    'Internet of Things (IoT)',
    'Robotics',
    'Game Development',
    'DevOps / Infrastructure',
    'Networking / Telecommunications',
    'Hardware Engineering',
    'Product Management (Tech)'
  ]).withMessage('Industry must be a valid technology industry'),
  handleValidation
], updateMyProfile);

router.get('/:id', authenticate, getUserById);

module.exports = router;