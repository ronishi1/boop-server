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

        logout:(_, __, { res }) => {
			res.clearCookie('refresh-token');
			res.clearCookie('access-token');
			return true;
		},

        register: async(_, args, { res }) => {
            const{ email, username, password } = args;
            const duplicateEmail = await User.findOne({email: email})
            if(duplicateEmail) {
                console.log('User with that email already registered.');
                return(new User({
                    _id: '',
                    email:'',
                    username: 'email already exists', 
                    password: '',
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
                }));
            }
            const duplicateUsername = await User.findOne({username: username})
            if (duplicateUsername) {
                console.log('User with the username already registered.')
                return(new User({
                    _id: '',
                    email:'',
                    username: 'username already exists', 
                    password: '',
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
                }));
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
        updateUsername: async(_, args, { res }) => {
            const { email, username } = args;
            const foundUser = await User.findOne({email: email});
            const updatedUsername = await User.updateOne({_id: foundUser._id}, {username: username});
            return true;
        },
        updatePassword: async(_, args, { res }) => {
            console.log(res.userId)
            const { email, oldPassword, newPassword} = args;
            const foundUser = await User.findOne({email: email});
            const valid = await bcrypt.compare(oldPassword, foundUser.password);
            if (!valid) {
               return false
            }
            const hashed = await bcrypt.hash(newPassword, 10)
            const updatedPassword = await User.updateOne({_id: foundUser._id}, {password: hashed});
            return true
        },
        updateEmail: async(_, args, { res }) => {
            const { oldEmail, newEmail, password } = args;
            const foundUser = await User.findOne({email: email});
            const valid = await bcrypt.compare(password, foundUser.password);
            if (!valid) {
               return false
            }
            const updatedEmail = await User.updateOne({_id: foundUser._id}, {email: newEmail});
            return true
        },
        deleteAccount: async(_, args,{ res }) => {
            const { email } = args;
            const foundUser = await User.findOne({email: email});
            const deleted = await User.deleteOne({_id: foundUser._id})
            return true
        },
        updateBio: async(_, args, { res }) => {
            const { email, newBio } = args;
            const foundUser = await User.findOne({email: email});
            const updatedBio = await User.updateOne({_id: foundUser._id}, {bio: newBio});
            return true

        }
    }
};
