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
    author_name: String
    replies: [ForumReply]
    num_replies: Int
    views: Int
    timestamp: DateTime
    topic: ID
  }
  type ForumReply {
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
    category: String
  }
  type ForumTopicPost{
    title: String
    author: String
    author_name: String
    timestamp: DateTime
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
  type Query {
    getGeneralPosts: [ForumTopic]
    getComicPosts: [ForumTopic]
    getStoryPosts: [ForumTopic]
    getPopularPosts: [ForumPost]
    getRecentPosts: [ForumPost]
    getOldestPosts: [ForumPost]
    getTopicPosts(topicId: ID): [ForumPost]
    getMostRepliedPosts: [ForumPost]
    getPost(postId: ID): ForumPost
    getMyPosts: [ForumPost]
  }
`;

module.exports = { typeDefs: typeDefs }
