const { UserInputError, AuthenticationError } = require('apollo-server');
const { User, Message } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { register, login } = require('../validators/user');
const { JWT_SECRET } = require('../config/config.json');

module.exports = {
  login: async (_, { username, password }) => {
    const { error } = login.validate(
      {
        username,
        password,
      },
      { abortEarly: false }
    );
    if (error) throw new UserInputError('Fail to login', { error });
    const user = await User.findOne({ where: { username } });
    if (!user) throw new UserInputError('Incorrect username or password');
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) throw new UserInputError('Incorrect username or password');

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    return user;
  },
  register: async (_, { username, email, password, repeatPassword }) => {
    const { error } = register.validate(
      {
        username,
        email,
        password,
        repeatPassword,
      },
      { abortEarly: false }
    );
    if (error) throw new UserInputError('Fail to register', { error });

    const userByUsername = await User.findOne({ where: { username } });
    const userByEmail = await User.findOne({ where: { email } });
    if (userByUsername) throw new UserInputError('Username already taken');
    if (userByEmail) throw new UserInputError('Email already taken');

    const salt = await bcrypt.genSalt(12);
    password = await bcrypt.hash(password, salt);
    await User.create({ username, email, password });
    return 'Registered successfully';
  },
  getFriends: async (_, __, { user }) => {
    if (!user) throw new AuthenticationError('Unauthenticated');
    const { username } = user;

    let users = await User.findAll({
      where: { username: { [Op.ne]: username } },
    });

    const messages = await Message.findAll({
      where: { [Op.or]: [{ from: username }, { to: username }] },
      order: [['createdAt', 'DESC']],
    });

    users = users.map(otherUser => {
      const latestMessage = messages.find(
        m => m.to === otherUser.username || m.from === otherUser.username
      );
      otherUser.latestMessage = latestMessage;
      return otherUser;
    });

    const friends = users.filter(
      otherUser => otherUser.latestMessage !== undefined
    );
    return friends;
  },
};
