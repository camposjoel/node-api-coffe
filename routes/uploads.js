const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImage, getImage } = require('../controllers/uploads');
const { validateCollection } = require('../helpers/dbValidators');
const { validateRequest, validateFileToUpload } = require('../middlewares');


const router = Router();

router.post('/', validateFileToUpload, uploadFile);

router.put('/:collection/:id', [
  validateFileToUpload,
  check('id', 'Require a valid ID').isMongoId(),
  check('collection').custom(c => validateCollection(c, ['users', 'products'])),
  validateRequest
], updateImage);

router.get('/:collection/:id', [
  check('id', 'Require a valid ID').isMongoId(),
  check('collection').custom(c => validateCollection(c, ['users', 'products'])),
  validateRequest
], getImage)


module.exports = router;