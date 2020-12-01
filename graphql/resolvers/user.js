const userController = require('../../controllers/user');

module.exports = {
  Query: {
    login: userController.login,
  },
  Mutation: {
    register: userController.register,
  },
};
