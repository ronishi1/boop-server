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
        getUser(email: String!): User
  }
  type Mutation {
      register(email: String!, username: String!, password: String!): User
  }
`;

module.exports = { typeDefs: typeDefs }
