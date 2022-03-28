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
    replies: [ForumReply]
    num_replies: Int
    views: Int
    timestamp: DateTime
    topic: ID
  }
  type ForumReply {
    author: String
    content: String
    timestamp: DateTime
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
    editPost(postID: ID, content:String, tags: [String]): Boolean
    deletePost(postID: ID): Boolean
    createReply(postID: ID, content: String): Boolean
    editReply(postID: ID, content: String, replyID: ID): Boolean
    deleteReply(postID: ID, replyID: ID): Boolean
  }
`;

module.exports = { typeDefs: typeDefs }