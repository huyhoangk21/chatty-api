const messageController = require('../../controllers/message');

module.exports = {
  Query: {
    getAllMessages: messageController.getAllMessages,
  },
  Mutation: {
    sendMessage: messageController.sendMessage,
  },
  Subscription: {
    newMessage: {
      subscribe: messageController.newMessage,
    },
  },
};
