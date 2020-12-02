const userController = require('../../controllers/user');

module.exports = {
  Query: {
    login: userController.login,
    getFriends: userController.getFriends,
  },
  Mutation: {
    register: userController.register,
  },
};
