const userResolvers = require('./user-resolvers');
const profileResolvers = require('./profile-resolvers');
const forumResolvers = require('./forum-resolvers');
const comicResolvers = require('./comic-resolvers');
const storyResolvers = require('./story-resolvers');
const contentResolvers = require('./content-resolvers');
module.exports = [userResolvers, profileResolvers,forumResolvers,comicResolvers, storyResolvers,contentResolvers];
