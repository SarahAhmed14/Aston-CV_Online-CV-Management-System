const express = require('express');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cv = require('../controllers/cvController');

const router = express.Router();

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
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

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

router.get('/cvs', cv.getAllCVs);
router.get('/cvs/search', cv.searchCVs);
router.get(
  '/cvs/:id',
  [param('id').isInt({ min: 1 }).withMessage('Valid id required')],
  validate,
  cv.getCVById
);

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
