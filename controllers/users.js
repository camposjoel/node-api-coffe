const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const GetUsers = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
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
const PostUsers = async (req, res) => {

  const { name, mail, password, role } = req.body;
  const user = new User({ name, mail, password, role });

  // check mail exists
  

  // hash password
  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json(user);
}

const PutUsers = async (req, res) => {
  const { id } = req.params;
  const {_id, password, google, mail, ...data } = req.body;

  //validate in BD
  if (password) {
    const salt = bcryptjs.genSaltSync();
    data.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, data);

  res.json(user);
}

const patchUsers = (req, res = response) => {
  res.json({
    msg: 'PATCH user - controller'
  });
}

const DeleteUsers = async (req, res = response) => {
  const { id } = req.params;

  // Borrado fisico
  //const user = await User.findByIdAndDelete(id);
  const user = await User.findByIdAndUpdate(id, { state: false });
  res.json(user);
}

module.exports = {
  GetUsers,
  PostUsers,
  PutUsers,
  DeleteUsers
}