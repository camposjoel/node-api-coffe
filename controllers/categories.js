const { request, response } = require('express');
const { Category } = require('../models');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const getCategories = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', ['name', 'role'])
      .skip(from)
      .limit(limit)
  ]);

  res.json({ total, users });
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id)
    .populate('user', ['name', 'role']);
  res.json(category);
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const addCategory = async (req, res) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${name} already exists`
    });
  }

  // generate data to save
  const data = {
    name,
    user: req.user._id
  }

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
}

// updateCategory
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { state , user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json(category);
}

// deleteCategory - state:false
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndUpdate(id, { state: false }, { new: true });
  res.json(deletedCategory);
}

module.exports = {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory
}