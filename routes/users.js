const { Router } = require('express');
const { check } = require('express-validator');
const { GetUsers, PostUsers, PutUsers, DeleteUsers } = require('../controllers/users');
const { isValidRole, isMailTaken, userExistById } = require('../helpers/dbValidators');
const { validateRequest, validateRoles, validateToken} = require('../middlewares');

const router = Router();

router.get('/', GetUsers);

router.post('/', [
  check('mail', 'Require a valid mail').isEmail(),
  check('mail').custom(isMailTaken),
  check('name', 'Name is required').not().isEmpty(),
  check('password', 'Password is required and 6 characters minimum').isLength({min: 6}),
  check('role').custom(isValidRole),
  validateRequest
], PostUsers);

router.put('/:id', [
  check('id', 'Require a valid ID').isMongoId(),
  check('id').custom(userExistById),
  validateRequest
], PutUsers);


router.delete('/:id', [
  validateToken,
  //validateRoleAdmin,
  validateRoles('ADMIN_ROLE', 'SOMETHING_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(userExistById),
  validateRequest
], DeleteUsers);

module.exports = router;