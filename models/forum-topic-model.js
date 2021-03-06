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
			required: true
		},
		description: {
			type: String,
		},
		category: {
			type: String,
            enum: ['General','Comics','Stories'],
		},

	}
);

const ForumTopic = model('ForumTopic', forumTopicSchema);
module.exports = ForumTopic;
