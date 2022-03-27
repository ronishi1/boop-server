const { model, Schema, ObjectId } = require('mongoose');

const forumTopicSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        topic_name: {
			type: String,
			required: true
		},
        topic_posts: {
			type: [ObjectId],
		},
        topic_description: {
			type: String,
		},
        category: {
			type: String,
		},
       
    }
    );
    
const ForumTopic = model('ForumTopic', forumTopicSchema);
module.exports = ForumTopic;