const { model, Schema, ObjectId } = require('mongoose');

const comicSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		series_title: {
			type: String,
			required: true
		},
		author: {
			type: ObjectId,
			required: true
		},
		author_username: {
			type: String,
			required: true
		},
		synopsis: {
			type: String,
			required: true
		},
		genres: {
			type: [String],
			required: true
		},
		num_chapters: {
			type: Number,
			required: true
		},
		chapters: {
			type: [ObjectId],
			required: true
		},
		views: {
			type: Number,
			required: true
		},
		num_favorites: {
			type: Number,
			required: true
		},
		discussion_post: {
			type: ObjectId,
			required: true
		},
		current_rating: {
			type: Number,
			required: true
		},
		num_of_ratings: {
			type: Number,
			required: true
		},
		total_ratings: {
			type: Number,
			required: true
		},
		publication_date: {
			type: Date,
			required: true
		},
		completed: {
			type: Boolean,
			required: true
		},
		cover_image: {
			type: String,
			required: true
		},

	},
);

const Comic = model('Comic', comicSchema);
module.exports = Comic;
