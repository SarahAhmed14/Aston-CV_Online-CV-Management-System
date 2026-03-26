const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../controllers/authController');

const router = express.Router();

// check if input validation passes
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(400).json({
    message: 'Validation failed',
    errors: result.array().map((e) => ({
      field: e.param,
      message: e.msg
    }))
  });
}

// register new user
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
  ],
  validate,
  auth.register
);

// user login
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  validate,
  auth.login
);

module.exports = router;
