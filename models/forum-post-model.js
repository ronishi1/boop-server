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
        linked_comic: {
			type: ObjectId,
		},
        linked_story: {
			type: ObjectId,
		},
        tags: {
			type: [String],
		},
        author: {
			type: ObjectId,
			required: true
		},
        replies: {type: [{
            author: {type: ObjectId, required: true},
            message: {type: String, required: true},
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
        timestamp: {
			type: Date,
			required: true
		},
    }
    );

const ForumPost = model('ForumPost', forumPostSchema);
module.exports = ForumPost;
