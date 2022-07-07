const jwt = require('jsonwebtoken');

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

module.exports = { generateJwt };
