const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Content = require('../models/content-model');

module.exports = {
  Query: {
    getUserProfile: async(_, args, { req }) => {
      const { username } = args;
      // const objId = new ObjectId(_id);
      const user = await User.findOne({username:username});
      console.log(user);
      // STRIP USER OBJECT POTENTIALLY BUT ONLY NECSESARY FIELDS MAY BE GRABBED AUTOMATICALLY
      return user;
    },
    getUserPublished: async(_, args, {req}) => {
      const { _id } = args;
      const userObjId = new ObjectId(_id);
      const user = await User.findOne({_id:userObjId});
      const userContent = await Content.find({_id: {$in: user.user_content}, publication_date: { $ne: new Date(null)} });
      let userWorks = userContent.map((content) => {
        return {title: content.series_title,cover_image: content.cover_image};
      });
      return userWorks;
    },
    getUserFavorites: async(_, args, {req}) => {
      const { _id } = args;
      const userObjId = new ObjectId(_id);
      const user = await User.findOne({_id:userObjId});
      const userFavorites = await Content.find({_id: {$in: user.favorites}});
      let userFavoriteWorks = userFavorites.map((content) => {
        return {title: content.series_title,cover_image: content.cover_image};
      });
      return userFavoriteWorks;
    },
    getUserActivityFeed: async(_, args, {req}) => {
      const { _id } = args;
      const userObjId = new ObjectId(_id);
      const user = await User.findOne({_id:userObjId});
      console.log(user.recent_activity);
      return user.recent_activity;
    }
  },
  Mutation: {
    followUser: async (_, args, { req,res }) => {
      // followID is the ID of the user to follow
      const { followID } = args;
      const followUserID = new ObjectId(followID);
      const currentUserID = new ObjectId(req.userId);
      const followUser = await User.findOne({_id:followUserID});
      const currentUser = await User.findOne({_id:currentUserID});

      // Add the current user as a follower to the other user
      followUser.followers.push(currentUser._id);
      // Add the followed user as a following for the current user
      currentUser.following.push(followUser._id);

      await User.updateOne({_id: currentUser._id}, {following: currentUser.following});
      await User.updateOne({_id: followUser._id}, {followers: followUser.followers});
      return true;
    },
    unfollowUser: async (_, args, { req,res }) => {
      // followID is the ID of the user to unfollow
      const { followID } = args;
      const followUserID = new ObjectId(followID);
      const currentUserID = new ObjectId(req.userId);
      const followUser = await User.findOne({_id:followUserID});
      const currentUser = await User.findOne({_id:currentUserID});
      // Remove current user from followers of followed user
      followUser.followers = followUser.followers.filter(f => f.toString() !== currentUser._id.toString());
      // Remove followed user from followings of current user
      currentUser.following = currentUser.following.filter(f => f.toString() !== followUser._id.toString());

      await User.updateOne({_id: currentUser._id}, {following: currentUser.following});
      await User.updateOne({_id: followUser._id}, {followers: followUser.followers});

      return true;
    },
  }
};
