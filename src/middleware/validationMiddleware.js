const { validationResult } = require('express-validator');

// Middleware to handle validation errors from express-validator
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = handleValidation;
