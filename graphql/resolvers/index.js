const User = require('./user');

module.exports = {
  Query: {
    hello: () => 'Hello World',
    ...User.Query,
  },
  Mutation: {
    ...User.Mutation,
  },
};
