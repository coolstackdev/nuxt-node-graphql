const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type User {
    _id: ID!
    email: String!
    password: String!
    role: String!
    createdTimezones: [Timezone!]
  }

  type AuthData {
    userId: ID!
    token: String!
    expiresAt: String!
  }

  type Timezone {
    _id: ID!
    name: String!
    city: String!
    differenceToGMT: Int!
    user: User!
  }

  input UserInput {
    email: String!
    password: String!
    role: String
  }

  input TimezoneInput {
    name: String!
    city: String!
    differenceToGMT: Int!
  }

  type RootQuery {
    users: [User!]!
    timezones: [Timezone!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User!
    createTimezone(timezoneInput: TimezoneInput): Timezone!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)