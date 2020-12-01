const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    hello: String!
    login(username: String!, password: String!): User!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      repeatPassword: String!
    ): String!
  }

  type User {
    username: String!
    email: String!
    imageUrl: String!
    createdAt: String!
    token: String
  }
`;
