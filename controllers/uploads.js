const path = require('path');
const fs = require('fs');
const { request, response } = require('express');
const { saveFile } = require('../helpers/uploadFile');
const { Product, User } = require('../models');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const uploadFile = async (req, res) => {
  try {
    const fileName = await saveFile(req.files);
    res.json({ fileName });
  } catch (msg) {
    res.status(400).json({ msg });
  }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const updateImage = async (req, res) => {
  const { id, collection } = req.params;

  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `User with id ${id} not exists` });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `Product with id ${id} not exists` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Something went wrong' });
  }

  // clean prev imgs
  if (model.img) {
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const nameFile = await saveFile(req.files, undefined, collection);
  model.img = nameFile;
  await model.save();
  res.json(model);
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const getImage = async (req, res) => {
  const { id, collection } = req.params;

  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `User with id ${id} not exists` });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `Product with id ${id} not exists` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Something went wrong' });
  }

  if (model.img) {
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const pathImg = path.join(__dirname, '../assets/no-image.jpg',);
  res.sendFile(pathImg);
}

module.exports = {
  getImage,
  uploadFile,
  updateImage
}