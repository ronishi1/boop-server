const { model, Schema, ObjectId } = require('mongoose');

const contentSchema = new Schema(
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
		},
		genres: {
			type: [String],
			enum: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha", "Music", "Mystery", "Psychological", "Romance", "SciFi", "Slice of Life", "Sports", "Supernatural", "Thriller"],
			required: true,
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
		},
		storyboard: {
			type: ObjectId
		},
		content_type: {
			type: String,
			enum: ["S","C"],
			required: true
		}
	},
);

const Content = model('Content', contentSchema);
module.exports = Content;
