const { model, Schema, ObjectId } = require('mongoose');

const userSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		profile_pic: {
			type: String,
		},
		username: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		user_bio: {
			type: String,
		},
		password: {
			type: String,
			required: true
		},
		favorite_comics: {
			type: [ObjectId],
		},
		favorite_stories: {
			type: [ObjectId],
		},
		read_list_comics: {
			type: [ObjectId],
		},
		read_list_stories: {
			type: [ObjectId],
		},
		following: {
			type: [ObjectId],
		},
		followers: {
			type: [ObjectId],
		},
		forum_posts: {
			type: [ObjectId],
		},
		user_comics: {
			type: [ObjectId],
		},
		user_stories: {
			type: [ObjectId],
		},
		recent_comics: {
			type: [ObjectId],
		},
		recent_stories: {
			type: [ObjectId],
		},
		recent_activity: {type: [{
			activity_type: {type: String, required: true},
			content_ID: {type: ObjectId, required: true}
		}]},
		replies_to_my_post: {type: [{
			reply_ID: {type: ObjectId, required: true},
			author: {type: ObjectId, required: true},
			author_name: {type: String, required: true},
			post: {type: ObjectId, required: true},
			post_name: {type: String, required: true},
			timestamp: {type: Date, required: true}
		}]},
		rated_comics: {type: [{
			comic: {type: ObjectId, required: true},
			rating: {type: Number, required: true}
		}]},
		rated_stories: {type: [{
			story: {type: ObjectId, required: true},
			rating: {type: Number, required: true}
		}]},

	},
);

const User = model('User', userSchema);
module.exports = User;
