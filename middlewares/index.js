const validateRole = require('./validateRole');
const validateRequest = require('./validateRequest');
const validateToken = require('./validateToken');
const validateFiles = require('./validateFiles');

module.exports = {
  ...validateRole,
  ...validateRequest,
  ...validateToken,
  ...validateFiles
}