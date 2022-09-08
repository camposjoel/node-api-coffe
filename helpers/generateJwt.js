const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJwt = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, process.env.PRIVATE_KEY, {
      expiresIn: '1h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('Token no generated');
      } else {
        resolve(token);
      }
    });
  });
}

const testJwt = async (token) => {
  try {
    if (token.length < 10) {
       return null
    }

    const { uid } = jwt.verify(token, process.env.PRIVATE_KEY)
    const user = await User.findById(uid)

    if (user && user.state) {
      return user
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

module.exports = { generateJwt, testJwt};
