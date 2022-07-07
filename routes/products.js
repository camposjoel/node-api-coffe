const { Router } = require('express');
const { check } = require('express-validator');
const {
  addProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct
} = require('../controllers/products');
const { productExistById, categoryExistById } = require('../helpers/dbValidators');
const { validateRequest, validateToken, validateRoleAdmin } = require('../middlewares');

const router = Router();


router.get('/', getProducts)

router.get('/:id', [
  check('id', 'ID not valid').isMongoId(),
  check('id').custom(productExistById),
  validateRequest
], getProduct)

router.post('/', [
  validateToken,
  check('name', 'Name is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('category', 'Category Id not valid').isMongoId(),
  check('category').custom(categoryExistById),
  validateRequest,
], addProduct)

router.put('/:id', [
  validateToken,
  check('id', 'ID not valid').isMongoId(),
  check('id').custom(productExistById),
  validateRequest
], updateProduct)

router.delete('/:id', [
  validateToken,
  validateRoleAdmin,
  check('id', 'ID not valid').isMongoId(),
  check('id').custom(productExistById),
  validateRequest
], deleteProduct)

module.exports = router;
