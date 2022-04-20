const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Content = require('../models/content-model');
const Chapter = require('../models/chapter-model');
const ForumPost = require('../models/forum-post-model');
const ForumTopic = require('../models/forum-topic-model');
const StoryBoard = require("../models/storyboard-model");
const cloudinary = require('cloudinary').v2

module.exports = {
  Query: {
    getContentInfo: async (_, args) => {
      const {contentID} = args;
      const contentId = new ObjectId(contentID);
      const content = await Content.findOne({_id: contentId})
      return content;
    },
    getContentChapter: async (_, args) => {
      const {chapterID} = args;
      const chapterId = new ObjectId(chapterID);
      const chapter = await Chapter.findOne({_id:chapterId})
      return chapter;
    },
    getChapters: async (_, args) => {
      const {chapterIDs} = args;
      let chapterItemObjs = []
      for(const chapterID of chapterIDs) {
        let chapterId = new ObjectId(chapterID);
        const chapter = await Chapter.findOne({_id:chapterId})
        chapterItemObjs.push({
          _id: chapter._id,
          chapter_title: chapter.chapter_title,
          publication_date: chapter.publication_date
        })
      }
      return chapterItemObjs;
    },
    getPopularContent: async () => {
      // unpublished represents the dateTime "1970-01-01T00:00:00.000Z"
      const unpublished = new Date(0)
      const query = {
        $and : [
          {"publication_date": {$ne: unpublished}}
        ]
      }
      const contents = await Content.find(query).sort({views:-1}).limit(20);
      return contents;
    },
    getRecentContent: async () => {
      const unpublished = new Date(0)
      const query = {
        $and : [
          {"publication_date": {$ne: unpublished}}
        ]
      }
      const contents = await Content.find(query).sort({publication_date:-1}).limit(20);
      return contents;
    },
    getTopRatedContent: async () => {
      const unpublished = new Date(0)
      const query = {
        $and : [
          {"publication_date": {$ne: unpublished}}
        ]
      }
      const contents = await Content.find(query).sort({current_rating:-1}).limit(20);
      return contents;
    },
    getReadList: async (_, args) => {
      const {userID} = args;
      const userId = new ObjectId(userID);
      const user = await User.findOne({_id:userId})
      const readLaterIDs = user.read_list
      let contentCards = []
      for(const contentID of readLaterIDs) {
        let contentId = new ObjectId(contentID);
        const content = await(Content.findOne({_id:contentId}));
        contentCards.push({
          _id: content._id,
          series_title: content.series_title,
          num_chapters: content.num_chapters,
          current_rating: content.current_rating,
          publication_date: content.publication_date,
          cover_image: content.cover_image
        })
      }
      return contentCards;
    },
    getFavorites: async (_,args) => {
      const {userID} = args;
      const userId = new ObjectId(userID);
      const user = await User.findOne({_id:userId})
      const favoriteIDs = user.favorites
      let contentCards = []
      for(const contentID of favoriteIDs) {
        let contentId = new ObjectId(contentID);
        const content = await(Content.findOne({_id:contentId}));
        contentCards.push({
          _id: content._id,
          series_title: content.series_title,
          num_chapters: content.num_chapters,
          current_rating: content.current_rating,
          publication_date: content.publication_date,
          cover_image: content.cover_image
        })
      }
      return contentCards;
    },
    getFilteredContent: async (_, args) => {
      const {genres, releaseYear, rating, completionStatus, contentType} = args
      const query = {
        $and: [
          {"content_type": {$eq: contentType}}
        ]
      }
      // Filtering on genres
      if (genres !== undefined && genres !== null) {
       query.$and.push(
          {"genres": { $all: genres}}
        )
      }

      // Filtering on publication date
      if (releaseYear > 0) {
        const startYear = new Date(`${releaseYear.toString()}-01-01T00:00:00Z`)
        let nextYear = releaseYear + 1;
        nextYear = new Date(`${nextYear.toString()}-01-01T00:00:00Z`)
        query.$and.push(
          {"publication_date": { $lte: nextYear, $gte: startYear}}
        )
      }

      // Filtering on comics greater than parameter rating
      if (rating !== undefined && rating !== null) {
        query.$and.push(
          {"current_rating": {$gte: rating}}
        )
      }

      // Filtering on completion status
      if (completionStatus !== undefined && completionStatus !== null) {
        query.$and.push(
          {"completed": {$eq: completionStatus}}
        )
      }

      const filteredComics = await Content.find(
        query
      )
      return filteredComics
    },
    getMyContent: async (_,args,{ req,res }) => {
      const userId = new ObjectId(req.userId);
      const user = await User.findOne({_id:userId})
      const userContentIDs = user.user_content;
      let contents = []
      for(const contentID of userContentIDs) {
        let contentId = new ObjectId(contentID);
        const content = await(Content.findOne({_id:contentId}));
        contents.push(content);
      }
      return contents;
    },
    getStoryboard: async (_,args) => {
      const {storyboardID} = args
      const storyboardId = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id:storyboardId});
      return storyboard;
    },
    getSearch: async (_, args) => {
      const {searchTerm} = args
      const searchedContent = await Content.find({series_title: {$regex: searchTerm, $options: "i"}})
      return searchedContent
    }

  },
  Mutation: {
    createContent: async (_, args, { req,res }) => {
      // *****************************************
      // *****************************************
      // *****************************************
      // *****************************************
      // *****************************************
      // *****************************************
      // REMEMBER TO FIGURE OUT COVER IMAGE FOR EVERYTHING HERE

      // Building out content object
      const {contentInput} = args;
      const userId = new ObjectId(req.userId);
      const forumId = new ObjectId();
      const userObj = await User.findOne({_id:userId});
      const contentId = new ObjectId();
      let contentInputObj = {
        _id: contentId,
        series_title: contentInput.series_title,
        author: userId,
        author_username: userObj.username,
        synopsis: "",
        genres: [],
        num_chapters: 0,
        chapters: [],
        views: 0,
        num_favorites: 0,
        discussion_post:forumId,
        current_rating: 5,
        num_of_ratings: 0,
        total_ratings: 0,
        publication_date: 0,
        completed: false,
        cover_image: '',
        content_type: contentInput.content_type,
      }

      // If the content is a story type, then also include a storyboard
      if(contentInput.content_type == "S"){
        contentInputObj.storyboard = new ObjectId();
        let storyBoardObj = new StoryBoard({
          _id: contentInputObj.storyboard,
          series_id: contentId,
          characters:[],
          plot_points: []
        });
        await storyBoardObj.save();
      }

      // Save the new content
      let contentObj = new Content(contentInputObj);
      await contentObj.save();

      // Save the content to the creator's list of content
      userObj.user_content.push(contentId);
      await User.updateOne({_id:userId},{user_content:userObj.user_content});

      // Build the auto generated forum post for the content, put in unpublished works in db and move when
      // the work is published
      const discussionTitle = contentInput.series_title + " Discussion";
      const timestamp = Date.now();
      const discussionContent = "Autogenerated discussion post for " + contentInput.series_title;
      // WHEN PUBLISHING A WORK NEED TO UPDATE IT TO GO UNDER COMIC DISCUSSIONS
      // Hard coded objectId for unpublished discussion post topic section
      const topicId = new ObjectId("6242239f4b2619473abf93b2");
      // Hard coded user id for automoderator
      const autoModID = new ObjectId("62421d2581c236eea8dd011f");
      const forumPost = new ForumPost ({
        _id: forumId,
        title: discussionTitle,
        content: discussionContent,
        tags: ["Discussion"],
        linked_content: contentId,
        linked_title:'',
        linked_image:'',
        author: autoModID,
        author_name: "AutoModerator",
        replies: [],
        num_replies: 0,
        views: 0,
        timestamp: timestamp,
        topic: topicId
      });
      await forumPost.save();

      // Save the forum post to the unpublished works topic
      const topic = await ForumTopic.findOne({_id:topicId});
      topic.posts.push(forumPost._id);
      await ForumTopic.updateOne({_id:topicId},{posts:topic.posts});

      return contentObj._id.toString();
    },
    editContent: async (_, args, { req,res }) => {
      const {contentID, contentInput} = args;
      const contentObjId = new ObjectId(contentID);

      // Pull the content and update the relevant fields
      const content = await Content.findOne({_id:contentObjId});
      await Content.updateOne({_id:contentObjId},
        {
          synopsis:contentInput.synopsis,
          series_title:contentInput.series_title,
          genres:contentInput.genres,
          cover_image:contentInput.cover_image
        }
      );

      // Update the discussion post title and content to match the new title
      const discussionPost = await ForumPost.findOne({_id:content.discussion_post})
      const newTitle = contentInput.series_title + " Discussion";
      const newContent = "Autogenerated discussion post for " + contentInput.series_title;
      await ForumPost.updateOne({_id:content.discussion_post},{title:newTitle,content:newContent});
      return content._id.toString();
    },
    deleteContent: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);

      // Delete the content and also storyboard if it is a story type
      const content = await Content.findOne({_id:contentObjId});
      if(content.content_type == "S"){
        await StoryBoard.deleteOne({_id:content.storyboard});
      }
      await Content.deleteOne({_id:contentObjId});

      // Delete the content from the user's list of content
      const user = await User.findOne({_id:content.author});
      user.user_content = user.user_content.filter(c => c.toString() !== contentID);
      await User.updateOne({_id:content.author},{user_content:user.user_content});

      // Delete the autogenerated post for the topic // DELETION ONLY POSSIBLE AUTOGENERATE UNPUBLISHED
      // const post = await ForumPost.findOne({_id:content.discussion_post});
      // await ForumPost.deleteOne({_id:content.discussion_post})


      const relatedPosts = await ForumPost.find({linked_content: contentObjId})
      // Delete all posts related to this content
      // await ForumPost.deleteMany({_id: {$in: relatedPosts}})
      // Delete all relatedPosts from the unpublished forum Topic
      await ForumTopic.updateOne({_id: new ObjectId("6242239f4b2619473abf93b2")}, {$pull: {posts: {$in: relatedPosts}}})

      // Remove the post from the topic
      // const topic = await ForumTopic.findOne({_id:post.topic});
      // topic.posts = topic.posts.filter(p => p.toString() !== post._id.toString());
      // await ForumTopic.updateOne({_id:post.topic},{posts:topic.posts});
      // Check to delete the content image if no post or content has a reference to the image url
      const linkedImage = content.cover_image
      const contentsContainsURL = await Content.find({cover_image: linkedImage})
      const postsContainURL = await ForumPost.find({linked_image: linkedImage})
      if (contentsContainsURL.length === 0 && postsContainURL === 0) {
        let groups = linkedImage.split("/");
        let temp = groups[groups.length-1].split(".");
        console.log(temp);
        cloudinary.uploader.destroy(temp[0]);
      }
      // Delete chapters
      await Chapter.deleteMany({series_id: contentObjId});

      return true;
    },
    updateCoverImage: async (_, args, { res }) => {
      const { contentID,url } = args;
      console.log(contentID);
      console.log(url);
      const contentObjId = new ObjectId(contentID);
      const foundContent = await Content.findOne({_id:contentObjId});
      if(foundContent.cover_image != ""){
        let groups = foundContent.cover_image.split("/");
        let temp = groups[groups.length-1].split(".");
        cloudinary.uploader.destroy(temp[0]);
        console.log(temp);

      }
      console.log("POST DESTROY");
      const updatedCoverImage = await Content.updateOne({_id: contentObjId}, {cover_image: url})
      return true
    },
    publishContent: async (_, args, { req, res }) => {
      const { contentID } = args;
      const contentObjId = new ObjectId(contentID);
      const content = await Content.findOne({_id:contentObjId});
      content.publication_date = Date.now()
      await Content.updateOne({_id: contentObjId}, {publication_date: content.publication_date});

      // Remove discussion post from unpublished topic
      const unpublishedTopic = await ForumTopic.findById(new ObjectId("6242239f4b2619473abf93b2"));
      newUnpublishedPosts = unpublishedTopic.posts.filter(e => !e.equals((content.discussion_post).toString()));
      await unpublishedTopic.updateOne({posts: newUnpublishedPosts});

      // Hard coded objectId for published discussion post topic section
      var topicId = null;
      switch(content.content_type) {
        // Story Discussions
        case "S":
          topicId = new ObjectId("624218db4b2619473abf93ab");
          break;
        // Comic Discussions
        case "C":
          topicId = new ObjectId("624216a0dd90b5c46c5e24d0");
          break;
        default:
          topicId = null;
      }
      // Invalid content_type
      if(topicId == null) return false;

      // Save the forum post to the published works topic
      const topic = await ForumTopic.findOne({_id:topicId});
      topic.posts.push(content.discussion_post);
      await ForumTopic.updateOne({_id:topicId},{posts:topic.posts});

      // Update topic field of post
      await ForumPost.findByIdAndUpdate(content.discussion_post, {topic: topicId});

      return true;
    },
    rateContent: async (_, args, { req,res }) => {
      const {contentID, rating} = args;
      const contentObjId = new ObjectId(contentID);
      const content = await Content.findOne({_id:contentObjId});
      const userObjId = new ObjectId(req.userId);
      const user = await User.findOne({_id:userObjId});

      // Get the rating that the user gave the content (if any)
      const rated = user.rated_content.filter(content => content.content_ID.toString() == contentID);
      // If there was no rating found, then just add to the tally and update the user's rated content
      if(rated.length == 0){
        content.num_of_ratings++;
        content.total_ratings += rating;
        content.current_rating = content.total_ratings / content.num_of_ratings;
        user.rated_content.push({content_ID:contentObjId,rating: rating});
      }
      else {
        // Otherwise if rating was found then update existing score
        content.total_ratings = content.total_ratings + rating - rated[0].rating;
        content.current_rating = content.total_ratings / content.num_of_ratings;
        user.rated_content.forEach((ratedContent,i) => {
          if(ratedContent.content_ID.toString() == contentID){
            user.rated_content[i] = {content_ID:contentObjId,rating: rating};
          }
        })
      }
      // Push the updated ratings to both the content and the user
      await User.updateOne({_id:userObjId},{rated_content:user.rated_content});
      await Content.updateOne({_id:contentObjId},
        {
          num_of_ratings:content.num_of_ratings,
          total_ratings:content.total_ratings,
          current_rating:content.current_rating
        }
      );
      return true;
    },
    addContentToReadList: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);
      const userObjId = new ObjectId(req.userId);

      // Find the user and push the content to their read list
      const user = await User.findOne({_id:userObjId});
      user.read_list.push(contentObjId);
      await User.updateOne({_id:userObjId},{read_list:user.read_list});
      return true;
    },
    addContentToFavorites: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);
      const userObjId = new ObjectId(req.userId);

      // Find the user and push the content to their read list
      const user = await User.findOne({_id:userObjId});
      user.favorites.push(contentObjId);
      await User.updateOne({_id:userObjId},{favorites:user.favorites});
      return true;
    },
    removeContentFromReadList: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);
      const userObjId = new ObjectId(req.userId);

      // Find the user and remove the content from their read list
      const user = await User.findOne({_id:userObjId});
      user.read_list = user.read_list.filter(content => content.toString() !== contentID);
      await User.updateOne({_id:userObjId},{read_list:user.read_list});
      return true;
    },
    removeContentFromFavorites: async (_, args, { req,res }) => {
      const {contentID} = args;
      const contentObjId = new ObjectId(contentID);
      const userObjId = new ObjectId(req.userId);

      // Find the user and remove the content from their read list
      const user = await User.findOne({_id:userObjId});
      user.favorites = user.favorites.filter(content => content.toString() !== contentID);
      await User.updateOne({_id:userObjId},{favorites:user.favorites});
      return true;
    },
    createChapter: async (_, args, { req, res }) => {
      const { contentID, chapterTitle } = args;
      const contentObjId = new ObjectId(contentID);
      const content = await Content.findOne({_id: contentObjId})
      const chapterId = new ObjectId();
      const pageId = new ObjectId();

      let firstPage = new Page({
        _id: pageId,
        page_content: ""
      })
      await firstPage.save()

      let chapterObj = new Chapter({
        _id: chapterId,
        series_id: contentObjId,
        chapter_title: chapterTitle,
        num_pages: 1,
        page_images: [],
        publication_date: 0
      })

      await chapterObj.save()
      let num_chapters = content.num_chapters + 1
      let chapters = content.chapters
      chapters.push(chapterId)
      await Content.updateOne({_id: contentObjId}, {
        num_chapters: num_chapters,
        chapters: chapters
      })

      return chapterId.toString();
    },
    editChapter: async (_, args, { req, res }) => {
      const { chapterID, chapter_title } = args;
      const chapter = await Chapter.findOne({_id:chapterID});
      await Chapter.updateOne({_id:chapterID},
      {
        chapter_title: chapter_title,
        publication_date: new Date.now()
      });
      return chapter._id.toString();
    },
    deleteChapter: async (_, args, { req, res }) => {
      const { chapterID } = args;
      const chapterObjId = new ObjectId(chapterID);
      const chapter = await Chapter.findOne({_id:chapterObjId})
      const contentObjId = new ObjectId(chapter.series_id)
      const content = await Content.findOne({_id:contentObjId})

      // Remove the chapter from the content
      content.chapters = content.chapters.filter(chapter => chapter.toString() !== chapterID)
      await Content.updateOne({_id: contentObjId}, {chapters:content.chapters})

      // Delete the actual chapter
      await Chapter.deleteOne({_id: chapterObjId})

      return true;
    },
    publishChapter: async (_, args, { req, res }) => {
      const { chapterID } = args;
      const chapterObjId = new ObjectId(chapterID);
      const chapter = await Chapter.findOne({_id:chapterObjId});
      chapter.publication_date = Date.now()
      await Chapter.updateOne({_id: chapterObjId}, {publication_date: chapter.publication_date})

      return true;
    },
    addPage: async (_, args, { req, res }) => {
      const { chapterID } = args;
      const chapterObjId = new ObjectId(chapterID);
      const chapter = await Chapter.findOne({_id: chapterObjId});
      let num_pages = chapter.num_pages + 1
      await Chapter.updateOne({_id: chapterObjId},
      {
        num_pages: num_pages,
      })
      return true;
    },
    savePage: async (_, args, { req, res }) => {
      const { chapterID, pageInput } = args;
      // Update the URL in the chapter Obj
      let chapterObjId = new ObjectId(chapterID);
      const chapter = await Chapter.findOne({_id: chapterObjId})
      // In the case that the image is there for the first time, need to append the image url
      if (chapter.page_images.length < pageInput.page_number) {
        let pageURLs = chapter.page_images
        while (pageURLs.length < pageInput.page_number) {
          pageURLs.push("Unsaved URL")
        }
        pageURLs[pageInput.page_number-1] = pageInput.url
        await Chapter.updateOne({_id: chapterObjId}, {
          page_images: pageURLs
        });
      }
      // Else we just need to update the current url stored in the chapter and delete it
      else {
        let page_images = chapter.page_images
        // Need to do page_number -1 because of index
        const prevURL = page_images[pageInput.page_number - 1]

        if (prevURL !== "Unsaved URL") {
          let groups = prevURL.cover_image.split("/");
          let temp = groups[groups.length-1].split(".");
          cloudinary.uploader.destroy(temp[0]);
        }
        page_images[pageInput.page_number - 1] = pageInput.url
        await Chapter.updateOne({_id: chapterObjId}, {
          page_images: page_images
        });
      }
      return true

    },
    deletePage: async (_, args, { req, res }) => {
      const { chapterID, pageNumber } = args;
      const chapterObjId = new ObjectId(chapterID);
      const chapter = await Chapter.findOne({_id: chapterObjId});
      // Delete the image from cloudinary
      let url = chapter.page_images[pageNumber-1]
      if (url !== undefined && url !== "Unsaved URL") {
        let groups = url.cover_image.split("/");
        let temp = groups[groups.length-1].split(".");
        cloudinary.uploader.destroy(temp[0]);
      }
      // Remove page url from chapter page_iages
      let page_images = chapter.page_images.filter((url, page_num) =>
        page_num !== pageNumber -1
      )
      console.log(page_images)
      let num_pages = chapter.num_pages - 1
      await Chapter.updateOne({_id: chapterObjId}, {
        num_pages: num_pages,
        page_images: page_images
      })
      return true
    },
    createCharacter: async (_, args, { req, res }) => {
      const { storyboardID, characterInput } = args;
      const storyboardObjID = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id:storyboardObjID});
      const characterId = new ObjectId();
      let characterObj =  {
        _id: characterId,
        character_name: characterInput.character_name,
        notes: characterInput.notes,
        character_image: characterInput.character_image
      }
      storyboard.characters.push(characterObj);
      await StoryBoard.updateOne({_id: storyboardObjID}, {characters: storyboard.characters})
      return characterObj._id.toString();
    },
    editCharacter: async (_, args, { req, res }) => {
      const { storyboardID, characterID, characterInput } = args;
      const storyboardObjID = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id: storyboardObjID});
      storyboard.characters.forEach((character) => {
        if (character._id == characterID) {
          character.character_name = characterInput.character_name
          character.notes = characterInput.notes
          character.character_image = characterInput.character_image
        }
      })
      await StoryBoard.updateOne({_id:storyboardObjID}, {characters:storyboard.characters})

      return storyboard._id.toString();
    },
    deleteCharacter: async (_, args, { req, res }) => {
      const { storyboardID, characterID } = args;
      const storyboardObjID = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id: storyboardObjID});
      storyboard.characters = storyboard.characters.filter(character => character._id.toString() !== characterID )
      await StoryBoard.updateOne({_id:storyboardObjID}, {characters: storyboard.characters})
      return true
    },
    createPlotPoint: async (_, args, { req, res }) => {
      const { storyboardID, plotpointInput } = args;
      const storyboardObjID = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id:storyboardObjID});
      const plotpointId = new ObjectId();
      let plotpointObj =  {
        _id: plotpointId,
        plot_point_name: plotpointInput.plot_point_name,
        notes: plotpointInput.notes,
        plot_point_image: plotpointInput.plot_point_image
      }
      storyboard.plot_points.push(plotpointObj);
      await StoryBoard.updateOne({_id: storyboardObjID}, {plot_points: storyboard.plot_points})
      return plotpointObj._id.toString();
    },
    editPlotPoint: async (_, args, { req, res }) => {
      const { storyboardID, plotpointID, plotpointInput } = args;
      const storyboardObjID = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id: storyboardObjID});
      storyboard.plot_points.forEach((plotpoint) => {
        if (plotpoint._id == plotpointID) {
          plotpoint.plot_point_name = plotpointInput.plot_point_name
          plotpoint.notes = plotpointInput.notes
          plotpoint.plot_point_image = plotpointInput.plot_point_image
        }
      })
      await StoryBoard.updateOne({_id:storyboardObjID}, {plot_points:storyboard.plot_points})

      return storyboard._id.toString();
    },
    deletePlotPoint: async (_, args, { req, res }) => {
      const { storyboardID, plotpointID } = args;
      const storyboardObjID = new ObjectId(storyboardID);
      const storyboard = await StoryBoard.findOne({_id: storyboardObjID});
      storyboard.plot_points = storyboard.plot_points.filter(plotpoint => plotpoint._id.toString() !== plotpointID )
      await StoryBoard.updateOne({_id:storyboardObjID}, {plot_points: storyboard.plot_points})
      return true
    }


  }
};
