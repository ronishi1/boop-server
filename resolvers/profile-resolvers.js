const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');

module.exports = {
  Query: {
    getUserProfile: async(_, args, { req }) => {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const user = await User.findOne({_id:objectId});
      // STRIP USER OBJECT POTENTIALLY BUT ONLY NECSESARY FIELDS MAY BE GRABBED AUTOMATICALLY
      return user;
    }
  },
  Mutation: {
    followUser: async (_, args, { res }) => {
      // followID is the ID of the user to follow
      const { followID } = args;
      const objId = new ObjectId(followID);
      const followUser = await User.findOne({_id:objectId});
      // followUser.followers.push(CURRENT USER ID GOES HERE);

      return true;
    },
    unfollowUser: async (_, args, { res }) => {
      // followID is the ID of the user to follow
      const { followID } = args;
      const objId = new ObjectId(followID);
      const followUser = await User.findOne({_id:objectId});

      return true;
    },
  }
};
