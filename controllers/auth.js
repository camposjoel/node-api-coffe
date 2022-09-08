const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const { generateJwt } = require('../helpers/generateJwt');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate email
    const user = await User.findOne({ mail: email });
    if (!user) {
      return res.status(400).json({
        msg: 'User/password not correct - email'
      });
    }

    // validate active user
    if (!user.state) {
      return res.status(400).json({
        msg: 'User/password not correct - state:false'
      });
    }
    
    // validate password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'User/password not correct - password'
      });
    }

    // generate jwt
    const token = await generateJwt(user.id);

    res.json({ user, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    });
  }
}


const refreshToken = async (req, res) => {
  const { user } = req
  const token = await generateJwt(user.id)
  res.json({ user, token })
}

module.exports = {
  login,
  refreshToken
}