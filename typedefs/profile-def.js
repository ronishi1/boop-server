const { gql } = require('apollo-server');

const typeDefs = gql`
  type Profile {
    _id: ID
    email: String!
    username: String!
    bio: String
    profile_pic: String
    favorites: [ID]
    following: [ID]
    followers: [ID]
    user_content: [ID]
  }
  type WorkCard {
    title: String
    cover_image: String
  }
  type Activity {
    activity_type: String
    content_ID: ID
  }
  type Query {
    getUserProfile(username: String): Profile
    getUserPublished(_id:ID): [WorkCard]
    getUserFavorites(_id:ID): [WorkCard]
    getUserActivityFeed(_id:ID): [Activity]
  }
  type Mutation {
    followUser(followID: ID!): Boolean
    unfollowUser(followID: ID!): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
