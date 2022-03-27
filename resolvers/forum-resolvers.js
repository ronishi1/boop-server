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
        timestamp: timestamp
      });
      // Find the user and add the forum post to their list of posts
      const foundUser = await User.findOne({_id:userId});
      foundUser.forum_posts.push(forumPost._id);

      // Find the topic and add the forum post to its list of posts
      const topicObjID = new ObjectId(postInput.topic_ID);
      const foundTopic = await ForumTopic.findOne({_id:topicObjID});
      foundTopic.topic_posts.push(forumPost._id);

      // Push all changes made to the DB
      await ForumTopic.updateOne({_id:topicObjID},{topic_posts: foundTopic.topic_posts});
      await User.updateOne({_id:userId},{forum_posts:foundUser.forum_posts});
      await forumPost.save();
      return forumPost;
    },
  }
};
