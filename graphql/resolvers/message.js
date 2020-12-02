const messageController = require('../../controllers/message');

module.exports = {
  Query: {},
  Mutation: {
    sendMessage: messageController.sendMessage,
  },
};
