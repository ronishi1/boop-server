const { gql } = require('apollo-server');

const typeDefs = gql`
  type Profile {
    email: String!
    username: String!
    user_bio: String
    profile_pic: String
    favorite_comics: [ID]
    favorite_stories: [ID]
    following: [ID]
    followers: [ID]
    user_comics: [ID]
    user_stories: [ID]
  }
  type Query {
    getUserProfile(_id: ID!): Profile
  }
  type Mutation {
    followUser(followID: ID!): Boolean
    unfollowUser(followID: ID!): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
