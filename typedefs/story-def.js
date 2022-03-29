const { gql } = require('apollo-server');

const typeDefs = gql`
  type Story {
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
    storyboard: ID
  }

  input StoryInput {
    series_title: String
    synopsis: String
    genres: [String]
    cover_image: String
  }

  type StoryBoard {
    series_id: ID
    characters: [character]
    plot_points: [plot_point]
  }

  type character {
    character_name: String
    notes: String
    character_image: String
  }

  type plot_point {
    plot_point_name: String
    notes: String
    plot_point_image: String
  }

  type Mutation {
    createStory(storyInput: StoryInput): Story
    editStory(storyID: String, storyInput: StoryInput): Boolean
    deleteStory(storyID: String): Boolean
    rateStory(storyID: String, rating: Int): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
