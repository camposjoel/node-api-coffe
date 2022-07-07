const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const VALID_COLLECTIONS = [
  'categories',
  'products',
  'roles',
  'users'
];

const SearchProducts = async (term, res) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const product = await Product.findById(term);
    return res.json({
      results: product ? [product] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const products = await Product.find({ name: regex, state: true })
                                .populate('category', 'name');

  res.json({
    results: products ? [products] : []
  });
}

const SearchCategories = async (term, res) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const categories = await Category.find({ name: regex, state: true })
                                   .populate('user', 'name');

  res.json({
    results: categories ? [categories] : []
  });
}

const SearchUsers = async (term, res) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const users = await User.find({
    $or: [{ name: regex }, { mail: regex }]
  });

  res.json({
    results: users ? [users] : []
  });
}

const search = async (req, res) => {
  const { collection, term } = req.params;

  if (!VALID_COLLECTIONS.includes(collection)) {
    return res.status(400).json({
      msg: `Valid collections are ${VALID_COLLECTIONS.toString()}`
    });
  }

  switch (collection) {
    case 'users':
        SearchUsers(term, res);
      break;
    case 'categories':
        SearchCategories(term, res);
      break;
    case 'products':
        SearchProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: 'No searching parameters'
      })
  }
}

module.exports = {
  search,
}