const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const validateToken = async (req, res, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      msg: 'Token not found'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);
    //read user with uid
    const user = await User.findById(uid);
    if (!user) {
      return res.status(401).json({
        msg: 'Token not valid - user not exists'
      });
    }

    //verify if user status is 'true'
    if (!user.state) {
      return res.status(401).json({
        msg: 'Token not valid - user not valid'
      });
    }

    req.user = user;
    next();
  
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Token not valid'
    });
  }
}

module.exports = { validateToken };
