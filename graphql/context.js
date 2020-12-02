const { PubSub } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json');
const pubsub = new PubSub();

module.exports = async context => {
  const { req, connection } = context;
  let token;
  if (req && req.headers.authorization) {
    token = req.headers.authorization.split('Bearer ')[1];
  }
  if (connection && connection.context.Authorization) {
    token = connection.context.Authorization.split('Bearer ')[1];
  }
  if (token) {
    context.user = jwt.verify(token, JWT_SECRET);
  }
  context.pubsub = pubsub;
  return context;
};
