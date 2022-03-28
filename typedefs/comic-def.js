const { gql } = require('apollo-server');

const typeDefs = gql`
  type Comic {
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
  }
  input ComicInput {
    series_title: String
    synopsis: String
    genres: [String]
    cover_image: String
  }
  type Mutation {
    createComic(comicInput: ComicInput): Comic
    editComic(comicID: ID, comicInput: ComicInput): Boolean
    deleteComic(comicID: ID): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
