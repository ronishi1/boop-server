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
    content_name: String
    chapter_ID: ID
    chapter_name: ID
    timestamp: DateTime
    _id: ID
  }
  type FollowedActivity {
    activity: Activity
    username: String
    _id: ID
  }
  type Query {
    getUserProfile(username: String): Profile
    getUserActivityFeed(username: String): [Activity]
    getFollowedActivity: [FollowedActivity]
  }
  type Mutation {
    followUser(followID: ID!): Boolean
    unfollowUser(followID: ID!): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
