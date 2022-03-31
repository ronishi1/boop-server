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
  type WorkCard {
    title: String
    cover_image: String
  }
  type Activity {
    activity_type: String
    content_ID: ID
  }
  type Query {
    getUserProfile(_id: ID!): Profile
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
