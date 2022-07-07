const { Router } = require('express');
const { check } = require('express-validator');
const {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory
} = require('../controllers/categories');
const { categoryExistById } = require('../helpers/dbValidators');
const { validateRequest, validateToken, validateRoleAdmin } = require('../middlewares');

const router = Router();

// get all categories - public
router.get('/', getCategories)

// get category by Id - public
router.get('/:id', [
  check('id', 'ID not valid').isMongoId(),
  check('id').custom(categoryExistById),
  validateRequest
], getCategory)

// add new category - all roles
router.post('/', [
  validateToken,
  check('name', 'Name is required').not().isEmpty(),
  validateRequest
], addCategory)

// update category - all roles
router.put('/:id', [
  validateToken,
  check('id', 'ID not valid').isMongoId(),
  check('id').custom(categoryExistById),
  check('name', 'Name is required').not().isEmpty(),
  validateRequest
], updateCategory)

// delete category - Admin
router.delete('/:id', [
  validateToken,
  validateRoleAdmin,
  check('id', 'ID not valid').isMongoId(),
  validateRequest,
  check('id').custom(categoryExistById)
], deleteCategory)

module.exports = router;
