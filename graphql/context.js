const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json');

module.exports = context => {
  const { req } = context;
  let token;
  if (req && req.headers.authorization) {
    token = req.headers.authorization.split('Bearer ')[1];
  }
  if (token) {
    req.user = jwt.verify(token, JWT_SECRET);
  }
  return context;
};
