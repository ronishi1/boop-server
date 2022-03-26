const { gql } = require('apollo-server');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "User" type defines the queryable fields for every book in our data source.
  type User {
    email: String!
    username: String!
    password: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
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
