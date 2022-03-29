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
    rated_comics: [ratedComics]
    rated_stories: [ratedStories]
  }

  type ratedComics {
    comic: ID
    rating: Int
  }

  type ratedStories {
    story: ID
    rating: Int
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
