const { Router } = require('express');
const { check } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');
const { login, refreshToken} = require('../controllers/auth');
const { validateToken } = require('../middlewares');

const router = Router();

router.post('/login', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  validateRequest
], login);

router.get('/', validateToken, refreshToken);

module.exports = router;