const { model, Schema, ObjectId } = require('mongoose');

const forumPostSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		linked_content: {
			type: ObjectId,
		},
		linked_title: {
			type: String,
		},
		linked_image: {
			type: String,
		},
		tags: {
			type: [String],
		},
		author: {
			type: ObjectId,
			required: true
		},
		author_name: {
			type: String,
			required: true
		},
		replies: {type: [{
			_id: {type: ObjectId, required: true},
			author: {type: ObjectId, required: true},
			author_name: {type: String, required: true},
			content: {type: String, required: true},
			timestamp: {type: Date, required: true}
		}]},
		num_replies: {
			type: Number,
			required: true
		},
		views: {
			type: Number,
			required: true
		},
		topic: {
			type: ObjectId,
			required: true
		},
		timestamp: {
			type: Date,
			required: true
		},
	}
);

const ForumPost = model('ForumPost', forumPostSchema);
module.exports = ForumPost;
