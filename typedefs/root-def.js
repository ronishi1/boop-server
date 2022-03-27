const { gql } = require('apollo-server');
const userDef = require('./user-def').typeDefs;
const profileDef = require('./profile-def').typeDefs

const rootDef = gql`
	extend type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`;

module.exports = {
	typeDefs: [rootDef, userDef, profileDef]
};
