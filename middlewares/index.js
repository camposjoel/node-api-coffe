const validateRole = require('./validateRole');
const validateRequest = require('./validateRequest');
const validateToken = require('./validateToken');

module.exports = {
  ...validateRole,
  ...validateRequest,
  ...validateToken
}