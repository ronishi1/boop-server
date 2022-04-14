const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    _id: ID
    email: String!
    username: String!
    password: String!
    bio: String
    profile_pic: String
    favorites: [ID]
    read_list: [ID]
    following: [ID]
    followers: [ID]
    forum_posts: [ID]
    user_content: [ID]
    recent_content: [ID]
    rated_content: [RatedContent]
    recent_activity: [Activity]
    replies_to_my_post: [Reply]
  }
  type RatedContent {
    content_ID: ID
    rating: Int
  }
  type Activity {
    activity_type: String
    content_ID: ID
  }
  type Reply {
    reply_ID: ID
    author: ID
    author_name: String
    post: ID
    post_name: String
    timestamp: DateTime
  }
  type Query {
    getCurrentUser: User
    getResetUser(reset_string: String!): Boolean
  }
  type Mutation {
    login(username: String!, password: String!): User
    logout: Boolean
    register(email: String!, username: String!, password: String!): User
    updateUsername(username: String!): Boolean
    updatePassword(oldPassword: String!, newPassword: String!): Boolean
    generateResetPassword(email: String!): Boolean
    resetPassword(email: String!, newPassword: String!): Boolean
    updateEmail(newEmail: String!, password: String!): Boolean

    #TODO
    updateProfilePicture: Boolean

    deleteAccount: Boolean
    updateBio(newBio: String!): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
