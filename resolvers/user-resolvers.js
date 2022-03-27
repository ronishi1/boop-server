const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user-model');
const tokens = require('../utils/tokens');


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
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
            console.log(user)
			if(!user) {
                throw new Error(
                    "Invalid Username"
                )
            };

			const valid = await bcrypt.compare(password, user.password);
			if(!valid) {
                throw new Error( 
                    "Invalid Password"
                )
            }
			// Set tokens if login info was valid
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true})
			return user;
		},

        logout:(_, __, { res }) => {
			res.clearCookie('refresh-token');
			res.clearCookie('access-token');
			return true;
		},

        register: async(_, args, { res }) => {
            const{ email, username, password } = args;
            const duplicateEmail = await User.findOne({email: email})
            if(duplicateEmail) {
                throw new Error(
                    "Email Already Exists"
                )
            }
            const duplicateUsername = await User.findOne({username: username})
            if (duplicateUsername) {
                throw new Error(
                    "Username Already Exists"
                )
            }
            const hashed = await bcrypt.hash(password, 10)
            const _id = new mongoose.Types.ObjectId();
            const user = new User({
                _id: _id,
                email: email,
                username: username,
                password: hashed,
                bio: '',
                profile_pic: '',
                favorite_comics: [],
                favorite_stories: [],
                read_later_comics: [],
                read_later_stories: [],
                following: [],
                followers: [],
                forum_posts: [],
                user_comics: [],
                user_stories: [],
                recent_comics: [],
                rated_comics: [],
                rated_stories: []
            })
            const saved = await user.save();
            return user;
        },
        updateUsername: async(_, args, { res, req }) => {
            const { username } = args;
            const userId = new ObjectId(req.userId);
            const duplicateUsername = await User.findOne({username:username})
            if (duplicateUsername) {
                throw new Error(
                    "Username Already Exists"
                )
            }
            const updatedUsername = await User.updateOne({_id: userId}, {username: username});
            return true;
        },
        updatePassword: async(_, args, { res, req }) => {
            const userId = new ObjectId(req.userId);
            const { oldPassword, newPassword} = args;
            const foundUser = await User.findOne({_id: userId});
            const valid = await bcrypt.compare(oldPassword, foundUser.password);
            if (!valid) {
               throw new Error(
                   "Invalid Password"
               )
            }
            const hashed = await bcrypt.hash(newPassword, 10)
            const updatedPassword = await User.updateOne({_id: foundUser._id}, {password: hashed});
            return true
        },
        updateEmail: async(_, args, { res, req }) => {
            const { newEmail, password } = args;
            const userId = new ObjectId(req.userId);
            const duplicateEmail = await User.findOne({email: newEmail});
            if (duplicateEmail) {
                throw new Error(
                    "Email Already Exists"
                )
            }
            const foundUser = await User.findOne({_id: userId});
            const valid = await bcrypt.compare(password, foundUser.password);
            if (!valid) {
                throw new Error(
                    "Invalid Password"
                )
            }
            const updatedEmail = await User.updateOne({_id: foundUser._id}, {email: newEmail});
            return true
        },
        deleteAccount: async(_, args,{ res, req }) => {
            const userId = new ObjectId(req.userId);
            const deleted = await User.deleteOne({_id: userId})
            return true
        },
        updateBio: async(_, args, { res, req }) => {
            const userId = new ObjectId(req.userId);
            const updatedBio = await User.updateOne({_id: userId}, {bio: newBio});
            return true

        }
    }
};
