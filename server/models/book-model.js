const { model, Schema, ObjectId } = require('mongoose');

const bookSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		title: {
			type: String,
			required: true
		},
    author: {
      type: String,
      required: true
    }
	},
);

const Book = model('Book', bookSchema);
module.exports = Book;
