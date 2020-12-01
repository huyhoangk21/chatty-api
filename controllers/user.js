const { UserInputError } = require('apollo-server');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    if (error) throw new UserInputError('Fail to login', { errors: error });
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
    if (error) throw new UserInputError('Fail to register', { errors: error });

    const userByUsername = await User.findOne({ where: { username } });
    const userByEmail = await User.findOne({ where: { email } });
    if (userByUsername) throw new UserInputError('Username already taken');
    if (userByEmail) throw new UserInputError('Email already taken');

    const salt = await bcrypt.genSalt(12);
    password = await bcrypt.hash(password, salt);
    await User.create({ username, email, password });
    return 'Registered successfully';
  },
};
