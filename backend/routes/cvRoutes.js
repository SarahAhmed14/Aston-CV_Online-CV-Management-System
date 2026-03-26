const express = require('express');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cv = require('../controllers/cvController');

const router = express.Router();

// verify JWT token before allowing access
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    // decode and validate token
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

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

// get all CVs
router.get('/cvs', cv.getAllCVs);

// search CVs
router.get('/cvs/search', cv.searchCVs);

// get CV by id
router.get(
  '/cvs/:id',
  [param('id').isInt({ min: 1 }).withMessage('Valid id required')],
  validate,
  cv.getCVById
);

// create new CV (requires login)
router.post(
  '/cvs',
  requireAuth,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('keyprogramming').trim().notEmpty().withMessage('Key programming required'),
    body('education').trim().notEmpty().withMessage('Education required'),
    body('profile').trim().notEmpty().withMessage('Profile required'),
    body('URLlinks').trim().notEmpty().withMessage('URL links required')
  ],
  validate,
  cv.createCV
);

// update CV (requires login)
router.put(
  '/cvs/:id',
  requireAuth,
  [
    param('id').isInt({ min: 1 }).withMessage('Valid id required'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('keyprogramming').trim().notEmpty().withMessage('Key programming required'),
    body('education').trim().notEmpty().withMessage('Education required'),
    body('profile').trim().notEmpty().withMessage('Profile required'),
    body('URLlinks').trim().notEmpty().withMessage('URL links required')
  ],
  validate,
  cv.updateCV
);

module.exports = router;
