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
		author: {
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
		page_JSONS: {
			type: [String]
		},
        publication_date: {
			type: Date,
			required: true
		},
		content_type: {
			type: String,
			required: true
		}
    }
);

const Chapter = model('Chapter', ChapterSchema);
module.exports = Chapter;