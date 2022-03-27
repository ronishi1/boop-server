const bookResolvers = require('./book-resolvers');
const userResolvers = require('./user-resolvers');
const profileResolvers = require('./profile-resolvers');

module.exports = [userResolvers, profileResolvers];
