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
    storyboard: ID
    content_type: String
  }
  input ContentInput {
    series_title: String
    synopsis: String
    genres: [String]
    cover_image: String
    content_type: String
  }
  type Chapter {
    _id: ID
    series_id: ID
    chapter_title: String
    num_pages: Int
    chapter_content: [String]
    publication_date: DateTime
  }
  input ChapterInput {
    chapter_title: String
    num_pages: Int
    chapter_content: [String]
    publication_date: DateTime
  }
  type Character {
    _id: ID
    character_name: String
    notes: String
    character_image: String
  }
  input CharacterInput {
    _id: ID
    character_name: String
    notes: String
    character_image: String
  }
  type PlotPoint {
    _id: ID
    plot_point_name: String
    notes: String
    plot_point_image: String
  }
  input PlotPointInput {
    _id: ID
    plot_point_name: String
    notes: String
    plot_point_image: String
  }
  type Query {
    getPopularContent(content_type: String): [Content]
    getTopRatedContent(content_type: String): [Content]
    getRecentContent(content_type: String): [Content]
  }
  type Mutation {
    createContent(contentInput: ContentInput): ID
    editContent(contentID: ID, contentInput: ContentInput): ID
    deleteContent(contentID: ID): Boolean
    rateContent(contentID: ID, rating: Int): Boolean
    addContentToReadList(contentID: ID): Boolean
    addContentToFavorites(contentID: ID): Boolean
    removeContentFromReadList(contentID: ID): Boolean
    removeContentFromFavorites(contentID: ID): Boolean
    createChapter(contentID: ID, chapter_title: String): ID
    editChapter(chapterID: ID, chapterInput: ChapterInput): ID
    deleteChapter(chapterID: ID): Boolean
    publishChapter(chapterID:ID): Boolean
    createCharacter(storyboardID: ID, characterInput: CharacterInput): ID
    editCharacter(storyboardID: ID, characterInput: CharacterInput): ID
    deleteCharacter(storyboardID: ID, characterID: ID): Boolean
    createPlotPoint(storyboardID: ID, plotpointInput: PlotPointInput): ID
    editPlotPoint(storyboardID: ID, plotpointInput: PlotPointInput): ID
    deletePlotPoint(storyboardID: ID, plotpointID: ID): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
