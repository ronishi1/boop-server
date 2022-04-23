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
    content_type: ContentType
  }
  type Chapter {
    _id: ID
    series_id: ID
    series_title: String
    chapter_title: String
    num_pages: Int
    page_images: [String]
    page_JSONS: [String]
    publication_date: DateTime
    content_type: ContentType
  }
  type ChapterItem {
    _id: ID
    chapter_title: String
    publication_date: DateTime
  }
  type ChapterView {
    chapter: Chapter,
    chapter_titles: [String]
    chapter_ids: [ID]
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
    page_number: Int
    url: String
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
    getChapterView(chapterID: ID): ChapterView
    getChapters(chapterIDs: [ID] ): [ChapterItem]
    getPopularContent: [Content]
    getTopRatedContent: [Content]
    getRecentContent: [Content]
    getReadList(username: String): [ContentCard]
    getFavorites(username: String): [ContentCard]
    getFilteredContent(genres: [String], releaseYears: [Int], rating: Int, contentTypes: [String]): [ContentCard]
    getMyContent: [Content]
    getStoryboard(storyboardID: ID): Storyboard
    getSearch(searchTerm: String): [ContentCard]
    getUserPublished(username:String): [Content]
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
    createChapter(contentID: ID, chapterTitle: String, seriesTitle: String, authorID: ID, contentType: String): ID
    editChapter(chapterID: ID, chapter_title: String): ID
    deleteChapter(chapterID: ID): Boolean
    publishChapter(chapterID:ID): Boolean
    addPage(chapterID: ID): Boolean
    savePage(chapterID: ID, pageNumber: Int, url: String, pageJSON: String): Boolean
    deletePage(chapterID: ID, pageNumber: Int): Boolean
    createCharacter(storyboardID: ID,  characterInput: CharacterInput): ID
    editCharacter(storyboardID: ID, characterID: ID, characterInput: CharacterInput): ID
    deleteCharacter(storyboardID: ID, characterID: ID): Boolean
    createPlotPoint(storyboardID: ID, plotpointInput: PlotPointInput): ID
    editPlotPoint(storyboardID: ID, plotpointID: ID, plotpointInput: PlotPointInput): ID
    deletePlotPoint(storyboardID: ID, plotpointID: ID): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }
