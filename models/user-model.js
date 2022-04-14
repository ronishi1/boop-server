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
		bio: {
			type: String,
		},
		reset_string: {
			type: String,
		},
		password: {
			type: String,
			required: true
		},
		favorites: {
			type: [ObjectId],
		},
		read_list: {
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
		user_content: {
			type: [ObjectId],
		},
		recent_content: {
			type: [ObjectId],
		},
		recent_activity: {type: [{
			activity_type: {type: String, required: true},
			content_ID: {type: ObjectId, required: true},
			reply_ID: {type: ObjectId}
		}]},
		replies_to_my_post: {type: [{
			reply_ID: {type: ObjectId, required: true},
			author: {type: ObjectId, required: true},
			author_name: {type: String, required: true},
			post: {type: ObjectId, required: true},
			post_name: {type: String, required: true},
			timestamp: {type: Date, required: true}
		}]},
		rated_content: {type: [{
			content_ID: {type: ObjectId, required: true},
			rating: {type: Number, required: true}
		}]},
	},
);

const User = model('User', userSchema);
module.exports = User;
