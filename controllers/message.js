const {
  AuthenticationError,
  UserInputError,
  withFilter,
} = require('apollo-server');
const { Op } = require('sequelize');
const { Message, User } = require('../models');
const { sendMessage } = require('../validators/message');

module.exports = {
  sendMessage: async (_, { to, content }, { user, pubsub }) => {
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

    const message = { from: fromUser, to: toUser, content };
    pubsub.publish('NEW_MESSAGE', { newMessage: message });
    return message;
  },
  newMessage: withFilter(
    (_, __, { user, pubsub }) => {
      if (!user) throw new AuthenticationError('Unauthenticated');
      return pubsub.asyncIterator(['NEW_MESSAGE']);
    },
    ({ newMessage }, _, { user }) => {
      if (
        newMessage.from.username === user.username ||
        newMessage.to.username === user.username
      ) {
        return true;
      }
      return false;
    }
  ),
  getAllMessages: async (_, { otherUser }, { user }) => {
    if (!user) throw new AuthenticationError('Unauthenticated');
    const thisUser = await User.findOne({ where: { username: user.username } });
    const username2 = otherUser;
    const other = await User.findOne({ where: { username: username2 } });
    if (!other) throw new UserInputError('User not found');
    const { username } = user;
    const usernames = [username2, username];
    let messages = await Message.findAll({
      where: { from: { [Op.in]: usernames }, to: { [Op.in]: usernames } },
      order: [['createdAt', 'DESC']],
    });
    messages = messages.map(m => {
      if (m.from === user.username) {
        (m.from = thisUser), (m.to = other);
      } else {
        (m.from = other), (m.to = thisUser);
      }
      return m;
    });
    return messages;
  },
};
