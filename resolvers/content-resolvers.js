const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Content = require('../models/content-model');
const ForumPost = require('../models/forum-post-model');
const ForumTopic = require('../models/forum-topic-model');
const StoryBoard = require("../models/storyboard-model");

module.exports = {
  Query: {
  },
  Mutation: {
    createContent: async (_, args, { req,res }) => {
      // *****************************************
      // *****************************************
      // *****************************************
      // *****************************************
      // *****************************************
      // *****************************************
      // REMEMBER TO FIGURE OUT COVER IMAGE FOR EVERYTHING HERE

      // Building out content object
      const {contentInput} = args;
      const userId = new ObjectId(req.userId);
      const forumId = new ObjectId();
      const userObj = await User.findOne({_id:userId});
      const contentId = new ObjectId();
      let contentInputObj = {
        _id: contentId,
        series_title: contentInput.series_title,
        author: userId,
        author_username: userObj.username,
        synopsis: contentInput.synopsis,
        genres: contentInput.genres,
        num_chapters: 0,
        chapters: [],
        views: 0,
        num_favorites: 0,
        discussion_post:forumId,
        current_rating: 5,
        num_of_ratings: 0,
        total_ratings: 0,
        publication_date: 0,
        completed: false,
        cover_image: contentInput.cover_image,
        content_type: contentInput.content_type,
      }

      // If the content is a story type, then also include a storyboard
      if(contentInput.content_type == "S"){
        contentInputObj.storyboard = new ObjectId();
        let storyBoardObj = new StoryBoard({
          _id: contentInputObj.storyboard,
          series_id: contentId,
          characters:[],
          plot_points: []
        });
        await storyBoardObj.save();
      }

      // Save the new content
      let contentObj = new Content(contentInputObj);
      await contentObj.save();

      // Save the content to the creator's list of content
      userObj.user_content.push(contentId);
      await User.updateOne({_id:userId},{user_content:userObj.user_content});

      // Build the auto generated forum post for the content, put in unpublished works in db and move when
      // the work is published
      const discussionTitle = contentInput.series_title + " Discussion";
      const timestamp = Date.now();
      const discussionContent = "Autogenerated discussion post for " + contentInput.series_title;
      // WHEN PUBLISHING A WORK NEED TO UPDATE IT TO GO UNDER COMIC DISCUSSIONS
      // Hard coded objectId for unpublished discussion post topic section
      const topicId = new ObjectId("6242239f4b2619473abf93b2");
      // Hard coded user id for automoderator
      const autoModID = new ObjectId("62421d2581c236eea8dd011f");
      const forumPost = new ForumPost ({
        _id: forumId,
        title: discussionTitle,
        content: discussionContent,
        tags: ["Discussion"],
        linked_content: contentId,
        author: autoModID,
        author_name: "AutoModerator",
        replies: [],
        num_replies: 0,
        views: 0,
        timestamp: timestamp,
        topic: topicId
      });
      await forumPost.save();

      // Save the forum post to the unpublished works topic
      const topic = await ForumTopic.findOne({_id:topicId});
      topic.posts.push(forumPost._id);
      await ForumTopic.updateOne({_id:topicId},{posts:topic.posts});

      return contentObj;
    },
    editContent: async (_, args, { req,res }) => {
      const {contentID, contentInput} = args;
      const contentObjId = new ObjectId(contentID);

      // Pull the content and update the relevant fields
      const content = await Content.findOne({_id:contentObjId});
      await Content.updateOne({_id:contentObjId},
        {
          synopsis:contentInput.synopsis,
          series_title:contentInput.series_title,
          genres:contentInput.genres,
          cover_image:contentInput.cover_image
        }
      );

      // Update the discussion post title and content to match the new title
      const discussionPost = await ForumPost.findOne({_id:content.discussion_post})
      const newTitle = contentInput.series_title + " Discussion";
      const newContent = "Autogenerated discussion post for " + contentInput.series_title;
      await ForumPost.updateOne({_id:content.discussion_post},{title:newTitle,content:newContent});
      return true;
    },
    deleteContent: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);

      // Delete the content and also storyboard if it is a story type
      const content = await Content.findOne({_id:contentObjId});
      if(content.content_type == "S"){
        await StoryBoard.deleteOne({_id:content.storyboard});
      }
      await Content.deleteOne({_id:contentObjId});

      // Delete the content from the user's list of content
      const user = await User.findOne({_id:content.author});
      user.user_content = user.user_content.filter(c => c.toString() !== contentID);
      await User.updateOne({_id:content.author},{user_content:user.user_content});

      // Delete the autogenerated post for the topic
      const post = await ForumPost.findOne({_id:content.discussion_post});
      await ForumPost.deleteOne({_id:content.discussion_post})

      // Remove the post from the topic
      const topic = await ForumTopic.findOne({_id:post.topic});
      topic.posts = topic.posts.filter(p => p.toString() !== post._id.toString());
      await ForumTopic.updateOne({_id:post.topic},{posts:topic.posts});

      return true;
    },
    rateContent: async (_, args, { req,res }) => {
      const {contentID, rating} = args;
      const contentObjId = new ObjectId(contentID);
      const content = await Content.findOne({_id:contentObjId});
      const userObjId = new ObjectId(req.userId);
      const user = await User.findOne({_id:userObjId});

      // Get the rating that the user gave the content (if any)
      const rated = user.rated_content.filter(content => content.content_ID.toString() == contentID);
      // If there was no rating found, then just add to the tally and update the user's rated content
      if(rated.length == 0){
        content.num_of_ratings++;
        content.total_ratings += rating;
        content.current_rating = content.total_ratings / content.num_of_ratings;
        user.rated_content.push({content_ID:contentObjId,rating: rating});
      }
      else {
        // Otherwise if rating was found then update existing score
        content.total_ratings = content.total_ratings + rating - rated[0].rating;
        content.current_rating = content.total_ratings / content.num_of_ratings;
        user.rated_content.forEach((ratedContent,i) => {
          if(ratedContent.content_ID.toString() == contentID){
            user.rated_content[i] = {content_ID:contentObjId,rating: rating};
          }
        })
      }
      // Push the updated ratings to both the content and the user
      await User.updateOne({_id:userObjId},{rated_content:user.rated_content});
      await Content.updateOne({_id:contentObjId},
        {
          num_of_ratings:content.num_of_ratings,
          total_ratings:content.total_ratings,
          current_rating:content.current_rating
        }
      );
      return true;
    },
    addContentToReadList: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);
      const userObjId = new ObjectId(req.userId);

      // Find the user and push the content to their read list
      const user = await User.findOne({_id:userObjId});
      user.read_list.push(contentObjId);
      await User.updateOne({_id:userObjId},{read_list:user.read_list});
    }
  }
};