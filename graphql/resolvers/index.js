const User = require('./user');
const Message = require('./message');

module.exports = {
  Query: {
    ...User.Query,
    ...Message.Query,
  },
  Mutation: {
    ...User.Mutation,
    ...Message.Mutation,
  },
  Subscription: {
    ...Message.Subscription,
  },
};
