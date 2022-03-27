const { gql } = require('apollo-server');

const typeDefs = gql`
  type ForumPost {
    _id: ID
    title: String
    content: String
    linked_comic: ID
    linked_story: ID
    tags: [String]
    author: ID
    replies: [ForumReplies]
    num_replies: Int
    views: Int
    timestamp: DateTime
  }
  type ForumReplies {
    author: String
    content: String
    timestamp: Int
  }
  type ForumTopic {
    _id: ID
    name: String
    posts: [ID]
    description: String
    category: String
  }
  type Link {
    title: String
    type: String
    author: String
    cover_image: String
    content: ID
  }
  input ForumPostInput {
    title: String
    content: String
    tags: [String]
    linked_comic: ID
    linked_story: ID
    topic_ID: ID
  }
  type Mutation {
    createPost(forumPost: ForumPostInput): ForumPost
  }
`;

module.exports = { typeDefs: typeDefs }
