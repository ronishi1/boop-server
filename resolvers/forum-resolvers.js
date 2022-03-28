const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');
const ForumPost = require('../models/forum-post-model');
const ForumTopic = require('../models/forum-topic-model');

module.exports = {
  Query: {
  },
  Mutation: {
    createPost: async (_, args, { req,res }) => {
      const currentUserID = new ObjectId(req.userId);
      let postInput = args.forumPost;
      let timestamp = Date.now();
      const _id = new mongoose.Types.ObjectId();
      const userId = new ObjectId(req.userId)
      const topicObjID = new ObjectId(postInput.topic_ID);
      // Build out forum post object to push to DB
      const forumPost = new ForumPost ({
        _id: _id,
        title: postInput.title,
        content: postInput.content,
        tags: postInput.tags,
        linked_comic: postInput.linked_comic,
        linked_story: postInput.linked_story,
        author: userId,
        replies: [],
        num_replies: 0,
        views: 0,
        timestamp: timestamp,
        topic: topicObjID
      });
      // Find the user and add the forum post to their list of posts
      const foundUser = await User.findOne({_id:userId});
      foundUser.forum_posts.push(forumPost._id);

      // Find the topic and add the forum post to its list of posts
      const foundTopic = await ForumTopic.findOne({_id:topicObjID});
      foundTopic.posts.push(forumPost._id);

      // Push all changes made to the DB
      await ForumTopic.updateOne({_id:topicObjID},{posts: foundTopic.topic_posts});
      await User.updateOne({_id:userId},{forum_posts:foundUser.forum_posts});
      await forumPost.save();
      return forumPost;
    },
    editPost: async (_, args, { req,res }) => {
      const {postID, content, tags} = args;
      const postObjectId = new ObjectId(postID);
      await ForumPost.updateOne({_id:postObjectId},{content: content,tags: tags});
      return true;
    },
    deletePost: async (_, args, { req,res }) => {
      const {postID} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      const foundTopic = await ForumTopic.findOne({_id:foundPost.topic});
      const foundUser = await User.findOne({_id:foundPost.author});
      foundUser.forum_posts.filter(p => p.toString !== postObjectId.toString());
      foundTopic.posts = foundTopic.posts.filter(p => p.toString() !== postObjectId.toString());
      await ForumTopic.updateOne({_id:foundPost.topic},{posts:foundTopic.posts});
      await User.updateOne({_id:foundPost.author},{forum_posts: foundUser.forum_posts});
      await ForumPost.deleteOne({_id:postObjectId});
      return true;
    },
    createReply: async (_, args, { req,res }) => {
      const {postID, content} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      let timestamp = Date.now();
      const userId = new ObjectId(req.userId)
      const _id = new mongoose.Types.ObjectId();
      let replyObj = {
        _id: _id,
        author: userId,
        content: content,
        timestamp: timestamp
      }
      foundPost.replies.push(replyObj);
      foundPost.num_replies++;
      await ForumPost.updateOne({_id:postObjectId},{replies:foundPost.replies,num_replies:foundPost.num_replies});
      return true;
    },
    editReply: async (_, args, { req,res }) => {
      const {postID, content, replyID} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      foundPost.replies.forEach((reply) => {
        if(reply._id.toString() == replyID) reply.content = content;
      })
      await ForumPost.updateOne({_id:postObjectId},{replies:foundPost.replies});
      return true;
    },
    deleteReply: async (_, args, { req,res }) => {
      const {postID, replyID} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      foundPost.replies = foundPost.replies.filter(r => r._id.toString() !== replyID);
      foundPost.num_replies--;
      await ForumPost.updateOne({_id:postObjectId},{replies: foundPost.replies,num_replies: foundPost.num_replies});
      return true;
    }

  }
};