const { gql } = require('apollo-server');

module.exports = gql`
  type Subscription {
    newMessage: Message
  }

  type Query {
    login(username: String!, password: String!): User!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      repeatPassword: String!
    ): String!
    sendMessage(to: String!, content: String!): Message!
  }

  type User {
    username: String!
    email: String!
    imageUrl: String!
    createdAt: String!
    token: String
  }

  type Message {
    from: User!
    to: User!
    content: String!
  }
`;
