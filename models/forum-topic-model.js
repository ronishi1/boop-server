const { model, Schema, ObjectId } = require('mongoose');

const forumTopicSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        name: {
			type: String,
			required: true
		},
        posts: {
			type: [ObjectId],
		},
        description: {
			type: String,
		},
        category: {
			type: String,
		},

    }
    );

const ForumTopic = model('ForumTopic', forumTopicSchema);
module.exports = ForumTopic;
