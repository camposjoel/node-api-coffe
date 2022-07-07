const { request, response } = require('express');
const { Product } = require('../models');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const getProducts = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('user', ['name', 'role'])
      .populate('category', 'name')
      .skip(from)
      .limit(limit)
  ]);

  res.json({ total, products });
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate('user', ['name', 'role'])
    .populate('category', 'name');
  res.json(product);
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const addProduct = async (req, res) => {
  const {state, user, ...data} = req.body;
  const productDB = await Product.findOne({ name: data.name });
  if (productDB) {
    return res.status(400).json({
      msg: `Product ${data.name} already exists`
    });
  }

  // generate data to save
  const payload = {
    ...data,
    name: data.name.toUpperCase(),
    user: req.user._id
  }

  const product = new Product(payload);
  await product.save();

  res.status(201).json(product);
}

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { state , user, ...data } = req.body;
  if (data.name) {
    data.name = data.name.toUpperCase();
  }
  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json(product);
}

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(id, { state: false }, { new: true });
  res.json(deletedProduct);
}

module.exports = {
  addProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct
}