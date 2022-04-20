const { model, Schema, ObjectId } = require('mongoose');

const ChapterSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        series_id: {
			type: ObjectId,
			required: true
		},
		series_title: {
			type: String,
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
		page_images: {
			type: [String],
			required: true
		},
        publication_date: {
			type: Date,
			required: true
		},
    }
);

const Chapter = model('Chapter', ChapterSchema);
module.exports = Chapter;