const { gql } = require('apollo-server');
const bookDef = require('./book-def').typeDefs;

const rootDef = gql`
	extend type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`;

module.exports = {
	typeDefs: [rootDef, bookDef]
};
