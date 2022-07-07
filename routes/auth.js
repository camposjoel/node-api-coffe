const { Router } = require('express');
const { check } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');
const { login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  validateRequest
], login);

module.exports = router;