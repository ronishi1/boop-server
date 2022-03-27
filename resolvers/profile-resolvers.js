const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');

module.exports = {
    Query: {
        getCurrentUser: async(_, args, { req }) => {
            userId = new ObjectId(req.userId)
            const user = await User.findOne(userId);
            return user;
        }
    },
    Mutation: {
        login: async (_, args, { res }) => {
			const { username, password } = args;

			const user = await User.findOne({username: username});
			if(!user) return({});

			const valid = await bcrypt.compare(password, user.password);
			if(!valid) return({});
			// Set tokens if login info was valid
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true});
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true});
			return user;
		},
  }
};
