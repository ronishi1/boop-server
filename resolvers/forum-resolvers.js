const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');
const ForumPost = require('../models/forum-post-model');
const ForumTopic = require('../models/forum-topic-model');

module.exports = {
  Query: {
    getGeneralPosts: async () => {
      const generalForumTopic = await ForumTopic.find({category: "General"});

      let topics = [];
      for(const forumTopic of generalForumTopic){
        let posts = [];
        let temp = forumTopic.posts.slice(-3);
        for(const topicPost of temp){
          let post = await ForumPost.findOne({_id:topicPost});
          posts.push(post);
        }
        let topic = {
          _id: forumTopic._id,
          name: forumTopic.name,
          posts: posts,
          description: forumTopic.description,
          category: forumTopic.category
        }
        topics.push(topic);
      }
      return topics;
    },
    getComicPosts: async () => {
      const generalForumTopic = await ForumTopic.find({category: "Comics"});

      let topics = [];
      for(const forumTopic of generalForumTopic){
        let posts = [];
        let temp = forumTopic.posts.slice(-3);
        for(const topicPost of temp){
          let post = await ForumPost.findOne({_id:topicPost});
          posts.push(post);
        }
        let topic = {
          _id: forumTopic._id,
          name: forumTopic.name,
          posts: posts,
          description: forumTopic.description,
          category: forumTopic.category
        }
        topics.push(topic);
      }
      return topics;
    },
    getStoryPosts: async () => {
      const generalForumTopic = await ForumTopic.find({category: "Stories"});

      let topics = [];
      for(const forumTopic of generalForumTopic){
        let posts = [];
        let temp = forumTopic.posts.slice(-3);
        for(const topicPost of temp){
          let post = await ForumPost.findOne({_id:topicPost});
          posts.push(post);
        }
        let topic = {
          _id: forumTopic._id,
          name: forumTopic.name,
          posts: posts,
          description: forumTopic.description,
          category: forumTopic.category
        }
        topics.push(topic);
      }
      return topics;
    },
    getPopularPosts: async () => {
      //get list of top 5 viewed posts
      const posts = await ForumPost.find().sort({views:-1}).limit(5);
      return posts;
    },
    getRecentPosts: async () => {
      //get list of top 5 newest posts
      const posts = await ForumPost.find().sort({timestamp:-1}).limit(5);
      return posts;
    },
    getOldestPosts: async () => {
      //get all posts sorted by timestamp in ascending order
      const posts = await ForumPost.find().sort({timestamp:1});
      return posts;
    },
    getTopicPosts: async (_,args) => {
      const id = new ObjectId(args.topicId);
      //find all forum posts whose topic fields match the provided ForumTopic id
      const forumTopicPosts = ForumPost.find({topic:id});
      return forumTopicPosts;
    },
    getMostRepliedPosts: async () => {
      //get all posts sorted by num_replies in descending order
      const posts = await ForumPost.find().sort({num_replies:-1});
      return posts;
    },
    getPost: async (_,args) => {
      const id = new ObjectId(args.postId);
      const post = await ForumPost.findById(id);
      return post;
    },
    getMyPosts: async (_,__,{req}) => {
      const userId = new ObjectId(req.userId);
      const posts = ForumPost.find({author: userId});
      return posts;
    },
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

      // Find the user and add the forum post to their list of posts
      const foundUser = await User.findOne({_id:userId});
      foundUser.forum_posts.push(_id);
      const forumPost = new ForumPost ({
        _id: _id,
        title: postInput.title,
        content: postInput.content,
        tags: postInput.tags,
        linked_comic: postInput.linked_comic,
        linked_story: postInput.linked_story,
        author: userId,
        author_name: foundUser.username,
        replies: [],
        num_replies: 0,
        views: 0,
        timestamp: timestamp,
        topic: topicObjID
      });

      // Find the topic and add the forum post to its list of posts
      const foundTopic = await ForumTopic.findOne({_id:topicObjID});
      foundTopic.posts.push(forumPost._id);

      // Push all changes made to the DB
      await ForumTopic.updateOne({_id:topicObjID},{posts: foundTopic.posts});
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

      foundUser.replies_to_my_post = foundUser.replies_to_my_post.filter(reply => reply.post.toString() !== postID);
      await ForumTopic.updateOne({_id:foundPost.topic},{posts:foundTopic.posts});
      await User.updateOne({_id:foundPost.author},{forum_posts: foundUser.forum_posts,replies_to_my_post:foundUser.replies_to_my_post});
      await ForumPost.deleteOne({_id:postObjectId});
      return true;
    },
    createReply: async (_, args, { req,res }) => {
      const {postID, content} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      let timestamp = Date.now();
      const userId = new ObjectId(req.userId)
      const user = await User.findOne({_id:userId});
      const _id = new mongoose.Types.ObjectId();
      let replyObj = {
        _id: _id,
        author: userId,
        author_name: user.username,
        content: content,
        timestamp: timestamp
      }
      foundPost.replies.push(replyObj);
      foundPost.num_replies++;
      let activityObj = {
        activity_type:"reply",
        content_ID: postObjectId
      }
      user.recent_activity.push(activityObj);
      if(user.recent_activity.length > 10){
        user.recent_activity.shift();
      }
      const postAuthor = await User.findOne({_id:foundPost.author});
      let authorReplyObj = {
        reply_ID: _id,
        author: userId,
        author_name: user.username,
        post: postObjectId,
        post_name: foundPost.title,
        timestamp: timestamp
      }
      postAuthor.replies_to_my_post.push(authorReplyObj);
      if(postAuthor.replies_to_my_post.length > 10){
        postAuthor.replies_to_my_post.shift();
      }
      await User.updateOne({_id:foundPost.author},{replies_to_my_post:postAuthor.replies_to_my_post});
      await User.updateOne({_id: userId}, {recent_activity: user.recent_activity});
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
      const postAuthor = await User.findOne({_id:foundPost.author});
      postAuthor.replies_to_my_post = postAuthor.replies_to_my_post.filter(reply => reply.reply_ID.toString() !== replyID);
      await User.updateOne({_id:foundPost.author},{replies_to_my_post:postAuthor.replies_to_my_post});
      await ForumPost.updateOne({_id:postObjectId},{replies: foundPost.replies,num_replies: foundPost.num_replies});
      return true;
    }

  }
};
