const { gql } = require('apollo-server');

const typeDefs = gql`
  type Content {
    _id: ID
    series_title: String
    author: ID
    author_username: String
    synopsis: String
    genres: [Genre]
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
    content_type: ContentType
  }
  enum Genre {
    Action
    Adventure
    Comedy
    Drama
    Fantasy
    Horror
    Mecha
    Music
    Mystery
    Psychological
    Romance
    SciFi
    Sports
    Supernatural
    Thriller
  }
  enum ContentType {
    S
    C
  }
  input ContentInput {
    series_title: String
    synopsis: String
    genres: [String]
    content_type: String
  }
  type ContentCard {
    _id: ID
    series_title: String
    num_chapters: Int
    current_rating: Float
    publication_date: DateTime
    cover_image: String
  }
  type Chapter {
    _id: ID
    series_id: ID
    chapter_title: String
    num_pages: Int
    pages: [ID]
    page_images: [String]
    publication_date: DateTime
  }
  type ChapterItem {
    _id: ID
    chapter_title: String
    publication_date: DateTime
  }
  type Storyboard {
    characters: [Character]
    plot_points: [PlotPoint]
  }
  type Character {
    _id: ID
    character_name: String
    notes: String
    character_image: String
  }
  input PageInput {
    _id: ID
    page_number: Int
    page_content: String
    url: String
  }
  type Page {
    _id: ID
    page_content: String
  }
  input CharacterInput {
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
    plot_point_name: String
    notes: String
    plot_point_image: String
  }
  type Query {
    getContentInfo(contentID: ID): Content
    getContentChapter(chapterID: ID): Chapter
    getChapters(chapterIDs: [ID] ): [ChapterItem]
    getPage(pageID: ID): Page
    getPopularContent: [Content]
    getTopRatedContent: [Content]
    getRecentContent: [Content]
    getReadList(userID: ID): [ContentCard]
    getFavorites(userID: ID): [ContentCard]
    getFilteredContent(genres: [String], releaseYear: Int, rating: Int, completionStatus: Boolean, contentType: String): [ContentCard]
    getMyContent: [Content]
    getStoryboard(storyboardID: ID): Storyboard
    getSearch(searchTerm: String): [ContentCard]
  }
  type Mutation {
    createContent(contentInput: ContentInput): ID
    updateCoverImage(contentID: ID, url: String): Boolean
    editContent(contentID: ID, contentInput: ContentInput): ID
    deleteContent(contentID: ID): Boolean
    publishContent(contentID: ID): Boolean
    rateContent(contentID: ID, rating: Int): Boolean
    addContentToReadList(contentID: ID): Boolean
    addContentToFavorites(contentID: ID): Boolean
    removeContentFromReadList(contentID: ID): Boolean
    removeContentFromFavorites(contentID: ID): Boolean
    createChapter(contentID: ID, chapterTitle: String): ID
    editChapter(chapterID: ID, chapter_title: String): ID
    deleteChapter(chapterID: ID): Boolean
    publishChapter(chapterID:ID): Boolean
    addPage(chapterID: ID): ID
    savePage(chapterID: ID, pageInput: PageInput ): Boolean
    deletePage(chapterID: ID, pageNumber: Int, pageID: ID): Boolean
    createCharacter(storyboardID: ID,  characterInput: CharacterInput): ID
    editCharacter(storyboardID: ID, characterID: ID, characterInput: CharacterInput): ID
    deleteCharacter(storyboardID: ID, characterID: ID): Boolean
    createPlotPoint(storyboardID: ID, plotpointInput: PlotPointInput): ID
    editPlotPoint(storyboardID: ID, plotpointID: ID, plotpointInput: PlotPointInput): ID
    deletePlotPoint(storyboardID: ID, plotpointID: ID): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
