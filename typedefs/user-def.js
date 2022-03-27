const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    email: String!
    username: String!
    password: String!
  }

  type Query {
    getCurrentUser(email: String!): User
  }
  type Mutation {
    login(username: String!, password: String!): User
    logout: Boolean
    register(email: String!, username: String!, password: String!): User
    updateUsername(email:String!, username: String!): Boolean
    updatePassword(email:String!, oldPassword: String!, newPassword: String!): Boolean
    updateEmail(oldEmail: String!, newEmail: String!, password: String!): Boolean
    
    #TODO
    updateProfilePicture: Boolean

    deleteAccount(email: String!): Boolean
    updateBio(email: String!, newBio: String!): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
