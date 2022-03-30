const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    email: String!
    username: String!
    password: String!
    bio: String
    profile_pic: String
    favorite_comics: [ID]
    favorite_stories: [ID]
    read_list_comics: [ID]
    read_list_stories: [ID]
    following: [ID]
    followers: [ID]
    forum_posts: [ID]
    user_comics: [ID]
    user_stories: [ID]
    recent_comics: [ID]
    recent_stories: [ID]
    rated_comics: [RatedComics]
    rated_stories: [RatedStories]
    recent_activity: [Activity]
    replies_to_my_post: [Reply]
  }
  type RatedComics {
    comic: ID
    rating: Int
  }
  type RatedStories {
    story: ID
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
  }
  type Mutation {
    login(username: String!, password: String!): User
    logout: Boolean
    register(email: String!, username: String!, password: String!): User
    updateUsername(username: String!): Boolean
    updatePassword(oldPassword: String!, newPassword: String!): Boolean
    passwordReset(email: String!, newPassword: String!): Boolean
    updateEmail(newEmail: String!, password: String!): Boolean

    #TODO
    updateProfilePicture: Boolean

    deleteAccount: Boolean
    updateBio(newBio: String!): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
