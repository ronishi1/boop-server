const { model, Schema, ObjectId } = require('mongoose');

const comicChapterSchema = new Schema(
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
        comic_chapter_content: {
			type: [ObjectId],
			required: true
		},
        publication_date: {
			type: Date,
			required: true
		},
    }
);

const ComicChapter = model('ComicChapter', comicChapterSchema);
module.exports = ComicChapter;