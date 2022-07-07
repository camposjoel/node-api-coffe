const { Role, User, Category, Product } = require('../models');

const isValidRole = async (role = '') => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} is not valid`)
  }
}

const isMailTaken = async (mail) => {
  const mailExists = await User.findOne({ mail });
  if (mailExists) {
    throw new Error(`Mail ${mail} is already taken`);
  }
}

const userExistById = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`User ID ${id} not exists`);
  }
}

const categoryExistById = async (id) => {
  const categoryExists = await Category.findById(id);
  if (!categoryExists) {
    throw new Error(`Category ID ${id} not exists`);
  }
}

const productExistById = async (id) => {
  const productExists = await Product.findById(id);
  if (!productExists) {
    throw new Error(`Product ID ${id} not exists`);
  }
}

module.exports = {
  categoryExistById,
  isMailTaken,
  isValidRole,
  productExistById,
  userExistById,
}