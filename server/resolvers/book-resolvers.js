const mongoose = require('mongoose');
const Book = require('../models/book-model');

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
module.exports = {
  Query: {
    getBook: async() => {
      const book = await Book.findOne({author: "ray"});
			return book
    }
  },
};
