const { AuthenticationError, UserInputError } = require('apollo-server');
const { Message, User } = require('../models');
const { sendMessage } = require('../validators/message');

module.exports = {
  sendMessage: async (_, { to, content }, { req: { user } }) => {
    if (!user) throw new AuthenticationError('Unauthenticated');
    const { username: fromUsername } = user;
    const fromUser = await User.findOne({ where: { username: fromUsername } });
    const { error } = sendMessage.validate(
      { to, content },
      { abortEarly: false }
    );
    if (error) throw new UserInputError('Fail to send message', { error });
    const toUser = await User.findOne({ where: { username: to } });
    if (!toUser) throw new UserInputError('User not found');
    if (fromUser.username === toUser.username)
      throw new UserInputError('Cannot send message to yourself');

    await Message.create({ from: fromUsername, to, content });
    return { from: fromUser, to: toUser, content };
  },
};
