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
    read_later_comics: [ID]
    read_later_stories: [ID]
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
