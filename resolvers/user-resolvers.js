const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user-model');
const tokens = require('../utils/tokens');
const Content = require('../models/content-model');
const Chapter = require('../models/chapter-model');
const ForumPost = require('../models/forum-post-model');
const StoryBoard = require("../models/storyboard-model");
const nodemailer = require("nodemailer");
const cloudinary = require('cloudinary').v2

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
module.exports = {
    Query: {
        getCurrentUser: async(_, args, { req }) => {
            userId = new ObjectId(req.userId)
            const user = await User.findOne({_id:userId});
            return user;
        },
        getResetUser: async(_, args) => {
          const {reset_string} = args;
          const user = await User.findOne({reset_string:reset_string});
          if(user) {
            return true;
          }
          return false;
        }
    },
    Mutation: {
        login: async (_, args, { res }) => {
			const { username, password } = args;

			const user = await User.findOne({username: username});
            console.log(user)
			if(!user) {
                throw new Error(
                    "Invalid username and password combination"
                )
            };

			const valid = await bcrypt.compare(password, user.password);
			if(!valid) {
                throw new Error(
                  "Invalid username and password combination"
                )
            }
			// Set tokens if login info was valid
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true});
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true})
			return user;
		},

        logout:(_, __, { res, req }) => {
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
                favorites: [],
                read_list: [],
                following: [],
                followers: [],
                forum_posts: [],
                user_content: [],
                rated_content: [],
                recent_activity: [],
                replies_to_my_post: [],
            })
            const saved = await user.save();
            const accessToken = tokens.generateAccessToken(user);
            const refreshToken = tokens.generateRefreshToken(user);
            res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true});
            res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true})
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
                   "Old password does not match"
               )
            }
            const hashed = await bcrypt.hash(newPassword, 10)
            const updatedPassword = await User.updateOne({_id: foundUser._id}, {password: hashed});
            return true
        },
        // Might change it later as we need another library to send the link to the email
        //  Then the email link redirects to the reset password page.
        //  User enters new password and then enters their new password.
        //  Page should have email and password to pass into mutation.
        generateResetPassword: async(_, args) => {
          const { email } = args;
          const foundUser = await User.findOne({email:email});
          if(foundUser == null){
            return;
          }
          let result = '';
          let length = 20;
          let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let charactersLength = characters.length;
          for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          await User.updateOne({email:email},{reset_string:result})
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "boop.cse416@gmail.com",
              pass: "boopboop416"
            },
          });
          let info = await transporter.sendMail({
            from: '"CSE416 Boop" <boop.cse416@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Password Reset Request", // Subject line
            html: `
            <div>Hello,
              <br></br> If you requested to reset your password, please do so by clicking
              <a href="http://localhost:3000/reset/${result}">here</a>.
              <br></br>
              Team Boop, CSE416
            </div>`, // plain text body
          });
          return;
        },
        resetPassword: async(_, args, { res }) => {
            const { reset_string,password } = args;
            console.log(args);
            const foundUser = await User.findOne({reset_string:reset_string});
            const hashed = await bcrypt.hash(password, 10);
            await User.updateOne({_id:foundUser._id},{password: hashed,reset_string:""});
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
            return true;
        },
        deleteAccount: async(_, args,{ res, req }) => {
            const { password } = args
            const userId = new ObjectId(req.userId);

            const foundUser = await User.findOne({_id:userId});

            const valid = await bcrypt.compare(password, foundUser.password);
            if (!valid) {
                throw new Error(
                    "Invalid Password"
                )
            }

            await User.deleteOne({_id: userId});
            await ForumPost.deleteMany({_id: {$in: foundUser.forum_posts}});

            const foundContent = await Content.find({_id: {$in: foundUser.user_content}});
            await Content.deleteMany({_id: {$in: foundUser.user_content}});
            await StoryBoard.deleteOne({_id: foundContent.storyboard});
            await Chapter.deleteMany({_id: {$in: foundContent.chapters}});
            return true;
        },
        updateBio: async(_, args, { res, req }) => {
            const { newBio } = args;
            const userId = new ObjectId(req.userId);
            const updatedBio = await User.updateOne({_id: userId}, {bio: newBio});
            return true;
        },
        updateProfilePicture: async(_, args, { res, req }) => {
            const { url } = args;
            console.log(url)
            const userId = new ObjectId(req.userId);
            const foundUser = await User.findOne({_id:userId});
            if(foundUser.profile_pic != ""){
              let groups = foundUser.profile_pic.split("/");
              let temp = groups[groups.length-1].split(".");
              console.log(temp);
              cloudinary.uploader.destroy(temp[0]);
            }
            console.log("POST DESTROY");
            const updatedProfilePicture = await User.updateOne({_id: userId}, {profile_pic: url})
            return true
        }
  }
};
