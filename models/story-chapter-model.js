const { model, Schema, ObjectId } = require('mongoose');

const storyChapterSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        series_id: {
			type: ObjectId,
			required: true
		},
        chapter_title: {
			type: String,
			required: true
		},
        num_pages: {
			type: Number,
			required: true
		},
        chapter_number: {
			type: Number,
			required: true
		},
        story_chapter_content: {
			type: String,
			required: true
		},
        publication_date: {
			type: Date,
			required: true
		},
    }
);

const StoryChapter = model('StoryChapter', storyChapterSchema);
module.exports = StoryChapter;