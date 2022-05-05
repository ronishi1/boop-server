const { gql } = require('apollo-server');

const typeDefs = gql`
  type ForumPost {
    _id: ID
    title: String
    content: String
    linked_content: ID
    linked_title: String
    linked_image: String
    linked_synopsis: String
    tags: [String]
    author: ID
    author_name: String
    replies: [ForumReply]
    num_replies: Int
    views: Int
    timestamp: DateTime
    topic: ID
  }
  type ManagementPost {
    _id: ID
    title: String
    timestamp: DateTime
    tags: [String]
  }
  type ManagementReply {
    author: ID
    author_name: String
    post: ID
    post_name: String
    timestamp: DateTime
  }
  type ForumReply {
    _id: ID
    author: String
    author_name: String
    content: String
    timestamp: DateTime
  }
  type ForumTopic {
    _id: ID
    name: String
    posts: [ForumTopicPost]
    description: String
    category: Category
  }
  type ForumTopicPost{
    _id: ID
    title: String
    author: String
    author_name: String
    timestamp: DateTime
    linked_title: String
    linked_image: String
    tags: [String]
    num_replies: Int
    replies: [ForumReply]
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
    linked_content: ID
    topic_ID: ID
  }
  enum Category {
    General
    Comics
    Stories
  }
  type Mutation {
    createPost(forumPost: ForumPostInput): ID
    editPost(postID: ID, content:String, tags: [String]): ID
    deletePost(postID: ID): Boolean
    createReply(postID: ID, content: String): ID
    editReply(postID: ID, content: String, replyID: ID): ID
    deleteReply(postID: ID, replyID: ID): Boolean
  }
  type Query {
    getCategoryPosts(category: Category): [ForumTopic]
    getPopularPosts: [ForumPost]
    getRecentPosts: [ForumPost]
    getOldestPosts: [ForumPost]
    getTopic(topicId: ID): ForumTopic
    getMostRepliedPosts: [ForumPost]
    getPost(postId: ID): ForumPost
    getMyPosts: [ManagementPost]
    getRepliesToMyPost: [ManagementReply]
  }
`;

module.exports = { typeDefs: typeDefs }
