const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Content = require('../models/content-model')
const ForumPost = require('../models/forum-post-model');
const ForumTopic = require('../models/forum-topic-model');
const cloudinary = require('cloudinary').v2

module.exports = {
  Query: {
    getCategoryPosts: async (_,args) => {
      // Get the topics in the category
      const generalForumTopic = await ForumTopic.find({category: args.category});

      // For each topic, build a list of posts to display
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
    getTopic: async (_,args) => {
      const id = new ObjectId(args.topicId);
      //find all forum posts whose topic fields match the provided ForumTopic id
      const forumTopic = await ForumTopic.findOne({_id:id});
      let posts = [];
      console.log(forumTopic);
      for(const topicPost of forumTopic.posts){
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
      console.log(topic);
      return topic;
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
      const foundUser = await User.findOne({_id: userId});
      const userPosts = await ForumPost.find({_id: {$in: foundUser.forum_posts}});
      return userPosts;
    },
    getRepliesToMyPost: async (_,__,{req}) => {
      const userId = new ObjectId(req.userId);
      const foundUser = await User.findOne({_id: userId});
      return foundUser.replies_to_my_post;
    },
    getSeriesTitles: async (_, args, { req,res }) => {
      const { seriesTitle } = args;
      let results = [];
      const searchedContent = await Content.find({series_title: {$regex: seriesTitle, $options: "i"}});
      searchedContent.forEach((content) => {
        results.push(content.series_title)
      })
      return results;
    }
  },
  Mutation: {
    createPost: async (_, args, { req,res }) => {
      const currentUserID = new ObjectId(req.userId);
      const _id = new mongoose.Types.ObjectId();
      const userId = new ObjectId(req.userId)

      // Find the user and add the forum post to their list of posts and push it
      const foundUser = await User.findOne({_id:userId});
      foundUser.forum_posts.push(_id);
      await User.updateOne({_id:userId},{forum_posts:foundUser.forum_posts});
      // const content = await Content.findOne({_id: new ObjectId(linked_content)})
      let content = ""
      if (args.forumPost.linked_content == null) {
        content = {
          _id: null,
          series_title: null,
          cover_image: null,
          synopsis: "No content linked"
        }
      }
      else {
        content = await Content.findOne({series_title: args.forumPost.linked_content});
      }
      

      // Build out forum post object to push to DB
      let postInput = args.forumPost;
      let timestamp = Date.now();
      let topicId = ""
      switch(postInput.topic) {
        case "Comic Recommendations":
          topicId = "6240df65172c648d223659cf"
          break;
        case "Comic Discussions":
          topicId = "624216a0dd90b5c46c5e24d0"
          break
        case "Comic Upcoming Releases":
          topicId = "624217bddd90b5c46c5e24d1"
          break
        case "Story Recommendations":
          topicId = "624217ffdd90b5c46c5e24d3"
          break
        case "Story Discussions":
          topicId = "624218db4b2619473abf93ab"
          break
        case "Story Upcoming Releases":
          topicId = "624218f04b2619473abf93ac"
          break
        case "Community Announcements":
          topicId = "6242195e4b2619473abf93ae"
          break
        case "Casual Discussion":
          topicId = "6242197c4b2619473abf93af"
          break
        case "Games, Music, and Entertainment":
          topicId = "624219954b2619473abf93b0"
          break
      }
      const topicObjID = new ObjectId(topicId);
      const forumPost = new ForumPost ({
        _id: _id,
        title: postInput.title,
        content: postInput.content,
        tags: postInput.tags,
        linked_content: content._id,
        linked_title: content.series_title,
        linked_image: content.cover_image,
        linked_synopsis: content.synopsis,
        author: userId,
        author_name: foundUser.username,
        replies: [],
        num_replies: 0,
        views: 0,
        timestamp: timestamp,
        topic: topicObjID
      });
      await forumPost.save();


      // // Find the topic and add the forum post to its list of posts and push it
      const foundTopic = await ForumTopic.findOne({_id:topicObjID});
      foundTopic.posts.push(forumPost._id);
      await ForumTopic.updateOne({_id:topicObjID},{posts: foundTopic.posts});

      return forumPost._id.toString();
    },
    editPost: async (_, args, { req,res }) => {
      // Update the post with updated content and tags
      const {postID, title, content, tags} = args;
      const postObjectId = new ObjectId(postID);
      await ForumPost.updateOne({_id:postObjectId},{title: title, content: content, tags: tags});
      return postID;
    },
    deletePost: async (_, args, { req,res }) => {
      const {postID} = args;
      const postObjectId = new ObjectId(postID);

      // Need to fetch to get initial data of what to delete, then delete the post
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      await ForumPost.deleteOne({_id:postObjectId});

      // Find the topic and remove the post from there
      const foundTopic = await ForumTopic.findOne({_id:foundPost.topic});
      foundTopic.posts = foundTopic.posts.filter(p => p.toString() !== postObjectId.toString());
      await ForumTopic.updateOne({_id:foundPost.topic},{posts:foundTopic.posts});

      // Remove the post from the author's list of forum posts and also update the replies
      const foundUser = await User.findOne({_id:foundPost.author});
      foundUser.forum_posts.filter(p => p.toString !== postObjectId.toString());
      foundUser.replies_to_my_post = foundUser.replies_to_my_post.filter(reply => reply.post.toString() !== postID);
      await User.updateOne({_id:foundPost.author},{forum_posts: foundUser.forum_posts,replies_to_my_post:foundUser.replies_to_my_post});

      // Check to delete the content image  if no post has a reference to the cover_image
      const linkedImage = foundPost.linked_image
      const contentsContainsURL = await Content.find({cover_image: linkedImage})
      const postsContainURL = await ForumPost.find({linked_image: linkedImage})
      if (contentsContainsURL.length === 0 && postsContainURL === 0) {
        let groups = linkedImage.split("/");
        let temp = groups[groups.length-1].split(".");
        console.log(temp);
        cloudinary.uploader.destroy(temp[0]);
      }
      return true;
    },
    createReply: async (_, args, { req,res }) => {
      const {postID, content} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      let timestamp = Date.now();
      const userId = new ObjectId(req.userId)
      const user = await User.findOne({_id:userId});

      // Build the reply obj to store in the forum post and push it
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
      await ForumPost.updateOne({_id:postObjectId},{replies:foundPost.replies,num_replies:foundPost.num_replies});

      // Build the activity obj to store in the user and push it
      // content_ID represents the id of the reply not the post
      // postId will be provided in relevant functions
      let activityObj = {
        activity_type:"reply",
        content_ID: postObjectId,
      }
      // If there are more than 10 recent activities, then get rid of the oldest one
      user.recent_activity.push(activityObj);
      if(user.recent_activity.length > 10){
        user.recent_activity.shift();
      }
      await User.updateOne({_id: userId}, {recent_activity: user.recent_activity});

      // Build the reply to post object to push to the author so they can keep track of replies
      const postAuthor = await User.findOne({_id:foundPost.author});
      let authorReplyObj = {
        reply_ID: _id,
        author: userId,
        author_name: user.username,
        post: postObjectId,
        post_name: foundPost.title,
        timestamp: timestamp
      }
      // If there are more than 10 recent replies, then get rid of the oldest one
      if(postAuthor !== null){
        postAuthor.replies_to_my_post.push(authorReplyObj);
        if(postAuthor.replies_to_my_post.length > 10){
          postAuthor.replies_to_my_post.shift();
        }
        await User.updateOne({_id:foundPost.author},{replies_to_my_post:postAuthor.replies_to_my_post});
      };
      
      return postID;
    },
    editReply: async (_, args, { req,res }) => {
      const {postID, content, replyID} = args;
      const postObjectId = new ObjectId(postID);
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      // Find the reply that matches and replace the content for it
      foundPost.replies.forEach((reply) => {
        if(reply._id.toString() == replyID) reply.content = content;
      })
      await ForumPost.updateOne({_id:postObjectId},{replies:foundPost.replies});
      return postID;
    },
    deleteReply: async (_, args, { req,res }) => {
      const {postID, replyID} = args;
      const postObjectId = new ObjectId(postID);
      const userObjId = new ObjectId(req.userId);

      // Removing the reply from the user's recent activity
      // const foundUser = await User.findOne({_id:userObjId});
      // foundUser.recent_activity = foundUser.recent_activity.filter(activity => activity.content_ID.toString() !== replyID);
      // await User.updateOne({_id:userObjId},{recent_activity:foundUser.recent_activity});

      // Removing the reply from the post
      const foundPost = await ForumPost.findOne({_id:postObjectId});
      foundPost.replies = foundPost.replies.filter(r => r._id.toString() !== replyID);
      foundPost.num_replies--;
      await ForumPost.updateOne({_id:postObjectId},{replies: foundPost.replies,num_replies: foundPost.num_replies});

      // Removing the reply from the author's list of replies to their post
      const postAuthor = await User.findOne({_id:foundPost.author});
      if(postAuthor){
        postAuthor.replies_to_my_post = postAuthor.replies_to_my_post.filter(reply => reply.reply_ID.toString() !== replyID);
        await User.updateOne({_id:foundPost.author},{replies_to_my_post:postAuthor.replies_to_my_post});
      }

      return true;
    }

  }
};
