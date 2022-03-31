const { gql } = require('apollo-server');

const typeDefs = gql`
  type Content {
    _id: ID
    series_title: String
    author: ID
    author_username: String
    synopsis: String
    genres: [String]
    num_chapters: Int
    chapters: [ID]
    views: Int
    discussion_post: ID
    current_rating: Float
    num_of_ratings: Int
    total_ratings: Int
    publication_date: DateTime
    completed: Boolean
    cover_image: String
    content_type: String
  }
  input ContentInput {
    series_title: String
    synopsis: String
    genres: [String]
    cover_image: String
    content_type: String
  }
  type Mutation {
    createContent(contentInput: ContentInput): Content
    editContent(contentID: ID, contentInput: ContentInput): Boolean
    deleteContent(contentID: ID): Boolean
    rateContent(contentID: ID, rating: Int): Boolean
    addContentToReadList(contentID: ID): Boolean
    addContentToFavorites(contentID: ID): Boolean
    removeContentFromReadList(contentID: ID): Boolean
    removeContentFromFavorites(contentID: ID): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
