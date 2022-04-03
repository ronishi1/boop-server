require('isomorphic-fetch');

const mongoose = require('mongoose');
require('dotenv').config();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user-model');
const Content = require('../models/content-model');
const Chapter = require('../models/chapter-model');
const ForumPost = require('../models/forum-post-model');
const ForumTopic = require('../models/forum-topic-model');
const StoryBoard = require("../models/storyboard-model");
const { loginTokenFunc, registerFunc } = require('./user-sc');
const { createContentFunc, editContentFunc, deleteContentFunc, 
    publishContentFunc, rateContentFunc, addToReadListFunc, 
    addToFavoritesFunc, removeFromReadListFunc, removeFromFavoritesFunc, 
    createChapterFunc, editChapterFunc, deleteChapterFunc, 
    publishChapterFunc, createCharacterFunc, editCharacterFunc, 
    deleteCharacterFunc, createPlotPointFunc, editPlotPointFunc, 
    deletePlotPointFunc, getContentInfoFunc, getContentChapterFunc, 
    getChaptersFunc, getPopularContentFunc, getTopRatedContentFunc,
    getRecentContentFunc, getReadListFunc, getFavoritesFunc, 
    getFilteredContentFunc, getMyContentFunc, getStoryboardFunc, getSearchFunc } = require("./content-sc");

/*SETUP TEST USER INFO */
const contentTestUser1 = {
    email: "contentTestUser1@email.com",
    username: "contentTestUser1", 
    password: "contentTestUser1password"
}
const contentTestUser2 = {
    email: "contentTestUser2@email.com",
    username: "contentTestUser2",
    password: "contentTestUser2password"
}
const testComic = {
    series_title: "Test Comic",
    synopsis: "synopsis for a test comic",
    genres: [],
    cover_image: "coverimagefortestcomic",
    content_type: "C"
}
const testStory = {
    series_title: "Test Story",
    synopsis: "synopsis for a test story",
    genres: [],
    cover_image: "coverimageforteststory",
    content_type: "S"
}

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));;

    /*DELETE ANY USERS WITH TEST CRITERIA */
    await User.deleteMany({email: contentTestUser1.email});
    await User.deleteMany({email: contentTestUser2.email});
    await User.deleteMany({username: contentTestUser1.username});
    await User.deleteMany({username: contentTestUser2.username});

    /*CREATE TEST USERS */
    await registerFunc(contentTestUser1.email, contentTestUser1.username, contentTestUser1.password);
    await registerFunc(contentTestUser2.email, contentTestUser2.username, contentTestUser2.password);
});

afterAll(async () => {
    /*DELETE TEST USERS FROM DB*/
    await User.deleteMany({email: contentTestUser1.email});
    await User.deleteMany({email: contentTestUser2.email});

    await mongoose.connection.close().catch(error => console.error(error));;
});

/*SCENARIO: TEST USER 1 CREATES A COMIC*/
test("createContent test for comic creation", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // Create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);

    const { data } = await createContentRes.json();

    //check that data returns id of Content object matches that in the test user's user_content
    const user = await User.findOne({email:contentTestUser2.email});
    expect(user.user_content.includes(data.createContent));

    //check that data returns id of Content object contains data that matches that which was specified in testComic
    const comic = await Content.findById(data.createContent);
    const comic_values = {
        series_title: comic.series_title,
        synopsis: comic.synopsis,
        genres: comic.genres,
        cover_image: comic.cover_image,
        content_type: comic.content_type
    };
    expect(comic_values).toStrictEqual(testComic);
});

/*SCENARIO: TEST USER 2 CREATES A STORY */
test("createContent test for story creation", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);

    const { data } = await createContentRes.json();

    //check that data returns id of Content object that can be found in test user's user_content
    const user = await User.findOne({email:contentTestUser2.email});
    expect(user.user_content.includes(data.createContent));

    //check that data returns id of Content object contains data that matches that which was specified in testStory
    const story = await Content.findById(data.createContent);
    const story_values = {
        series_title: story.series_title,
        synopsis: story.synopsis,
        genres: story.genres,
        cover_image: story.cover_image,
        content_type: story.content_type
    };
    expect(story_values).toStrictEqual(testStory);
});

/*SCENARIO: TEST USER 1 EDITS A COMIC */
test("editContent test for comics", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // Get a comic from test user's user_content
    const user = await User.findOne({email: contentTestUser1.email});
    const comic = await Content.findById(user.user_content[0]);

    // Set updated values
    const editedValues = {
        synopsis: "changed synopsis",
        series_title: "title change",
        genres: ["Action"],
        cover_image: "newcoverimage"
    }
    
    const editContentRes = await editContentFunc(comic._id, editedValues, refreshToken, accessToken);

    // CHECK RETURN VALUE
    const { data } = await editContentRes.json();
    expect(data.editContent == comic._id);

    const updatedComic = await Content.findById(comic._id);
    const updatedComicValues = {
        synopsis: updatedComic.synopsis,
        series_title: updatedComic.series_title,
        genres: updatedComic.genres,
        cover_image: updatedComic.cover_image
    }
    // CHECK IF CONTENT HAS BEEN UPDATED IN THE DB
    expect(updatedComicValues).toStrictEqual(editedValues);

    // CHECK IF DISCUSSION POST HAS BEEN UPDATED IN THE DB
    const post = await ForumPost.findById(updatedComic.discussion_post);
    expect(post.title).toStrictEqual(editedValues.series_title + " Discussion");
    expect(post.content).toStrictEqual("Autogenerated discussion post for " + editedValues.series_title);
});

// /*SCENARIO: TEST USER 2 EDITS A STORY */
test("editContent test for stories", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // Get a comic from test user's user_content
    const user = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user.user_content[0]);

    // Set updated values
    const editedValues = {
        synopsis: "changed synopsis",
        series_title: "title change",
        genres: ["Action","Adventure"],
        cover_image: "newcoverimage"
    }
    
    // SEND REQUEST TO EDIT STORY
    const editContentRes = await editContentFunc(story._id, editedValues, refreshToken, accessToken);

    // CHECK RETURN VALUE
    const { data, errors } = await editContentRes.json();
    expect(data.editContent == story._id);

    const updatedStory = await Content.findById(story._id);
    const updatedStoryValues = {
        synopsis: updatedStory.synopsis,
        series_title: updatedStory.series_title,
        genres: updatedStory.genres,
        cover_image: updatedStory.cover_image
    }
    // CHECK IF CONTENT HAS BEEN UPDATED IN THE DB
    expect(updatedStoryValues).toStrictEqual(editedValues);

    // CHECK IF DISCUSSION POST HAS BEEN UPDATED IN THE DB
    const post = await ForumPost.findById(updatedStory.discussion_post);
    expect(post.title).toStrictEqual(editedValues.series_title + " Discussion");
    expect(post.content).toStrictEqual("Autogenerated discussion post for " + editedValues.series_title);
});

// TEST USER 1 DELETES A COMIC
test("deleteContent for deleting an unpublished comic", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    const user = await User.findOne({email: contentTestUser1.email});
    const comic = await Content.findById(user.user_content[0]);
    const post = await ForumPost.findById(comic.discussion_post);

    // SEND REQUEST TO DELETE COMIC
    const deleteContentRes = await deleteContentFunc(comic._id, refreshToken, accessToken);

    // CHECK RETURN VALUE OF MUTATION
    const { data } = await deleteContentRes.json();
    expect(data.deleteContentRes);

    // CHECK DELETION OF CONTENT FROM:
    // FORUMTOPICS
    const topics = await ForumTopic.findById(post.topic);
    expect(!topics.posts.includes(comic.discussion_post));
    // FORUMPOSTS
    expect(await ForumPost.findById(comic.discussion_post)).toStrictEqual(null);
    // CONTENT
    expect(await Content.findById(comic._id)).toStrictEqual(null);
    // USER_CONTENT
    expect(!user.user_content.includes(comic._id));
});

// TEST USER 2 PUBLISHES A STORY
test("publishContent for publishing an unpublished story", async () => {
    //Log in as test user 2
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    const user = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user.user_content[0]);
    const post = await ForumPost.findById(story.discussion_post);

    // SEND REQUEST TO PUBLISH STORY
    const publishContentRes = await publishContentFunc(story._id, refreshToken, accessToken);

    // CHECK RETURN VALUE OF MUTATION
    const { data } = await publishContentRes.json();
    expect(data.publishContent);

    // CHECK FORUM POST HAS BEEN REMOVED FROM UNPUBLISHED TOPIC
    const topics = await ForumTopic.findById(post.topic);
    expect(!topics.posts.includes(story.discussion_post));
    // CHECK FORUM POST TOPIC HAS BEEN CHANGED
    const updatedStory = await Content.findById(story._id);
    const updatedForum = await ForumPost.findById(updatedStory.discussion_post);
    expect(updatedForum.topic).toStrictEqual(new ObjectId("624218db4b2619473abf93ab"));
    // CHECK NEW FORUM TOPIC INCLUDES FORUM POST
    const newTopics = await ForumTopic.findById(updatedForum.topic);
    expect(newTopics.posts.includes(updatedForum._id));

});

// TEST USER 1 RATES A STORY
test("rateStory for rating a published story", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // Get test user 2's story
    const user1 = await User.findOne({email: contentTestUser1.email});
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);
    const rating = 5;

    const rateContentRes = await rateContentFunc(story._id, rating, refreshToken, accessToken);

    const { data } = await rateContentRes.json();

    // CHECK RETURN VALUE
    expect(data.rateContent);

    // RATING UPDATE FOR USER
    const updatedUser1 = await User.findById(user1._id);
    expect(updatedUser1.rated_content.includes({content_ID:story._id,rating: rating}));

    // RATING UPDATE FOR CONTENT
    const updatedStory = await Content.findById(story._id);
    expect(updatedStory.num_of_ratings == 1 &&
            updatedStory.total_ratings == rating &&
            updatedStory.current_rating == rating);
});

// TEST USER 1 RERATES A STORY
test("rateStory for rerating a published story", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // Get test user 2's story
    const user1 = await User.findOne({email: contentTestUser1.email});
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);
    const rating = 8;

    const rateContentRes = await rateContentFunc(story._id, rating, refreshToken, accessToken);

    const { data } = await rateContentRes.json();

    // CHECK RETURN VALUE
    expect(data.rateContent);

    // RATING UPDATE FOR USER
    const updatedUser1 = await User.findById(user1._id);
    expect(updatedUser1.rated_content.includes({content_ID:story._id,rating: rating}));

    // RATING UPDATE FOR CONTENT
    const updatedStory = await Content.findById(story._id);
    expect(updatedStory.num_of_ratings == 1 &&
            updatedStory.total_ratings == rating &&
            updatedStory.current_rating == rating);
});

// TEST USER 2 RATES A STORY
test("rateStory for more than one rating on a published story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // Get test user 2's story
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);
    const rating = 10;

    const rateContentRes = await rateContentFunc(story._id, rating, refreshToken, accessToken);

    const { data } = await rateContentRes.json();

    // CHECK RETURN VALUE
    expect(data.rateContent);

    // RATING UPDATE FOR USER
    const updatedUser2 = await User.findById(user2._id);
    expect(updatedUser2.rated_content.includes({content_ID:story._id,rating: rating}));

    // RATING UPDATE FOR CONTENT
    const updatedStory = await Content.findById(story._id);
    expect(updatedStory.num_of_ratings == 2 &&
            updatedStory.total_ratings == rating &&
            updatedStory.current_rating == 9);
})

// TEST USER 2 ADDS STORY TO READ LIST
test("addContentToReadList for a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // get user 2's story
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);

    const readListRes = await addToReadListFunc(story._id, refreshToken, accessToken);

    const { data } = await readListRes.json();

    // CHECK RETURN VALUE
    expect(data.addContentToReadList);

    // CHECK FOR STORY IN USER 2 READ LIST
    const updatedUser2 = await User.findById(user2._id);
    expect(updatedUser2.read_list.includes(story._id));
});

// TEST USER 2 ADDS STORY TO FAVORITES LIST
test("addContentToFavorites for a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // get user 2's story
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);

    const favoritesRes = await addToFavoritesFunc(story._id, refreshToken, accessToken);

    const { data } = await favoritesRes.json();

    // CHECK RETURN VALUE
    expect(data.addContentToFavorites);

    // CHECK FOR STORY IN USER 2 FAVORITES LIST
    const updatedUser2 = await User.findById(user2._id);
    expect(updatedUser2.favorites.includes(story._id));
});

// TEST USER 2 REMOVES STORY FROM READ LIST
test("removeContentFromReadList for a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // get user 2's story
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);

    const readListRes = await removeFromReadListFunc(story._id, refreshToken, accessToken);

    const { data } = await readListRes.json();

    // CHECK RETURN VALUE
    expect(data.removeContentFromReadList);

    // CHECK FOR STORY IN USER 2 READ LIST
    const updatedUser2 = await User.findById(user2._id);
    expect(!updatedUser2.read_list.includes(story._id));
})

// TEST USER 2 REMOVES STORY FROM FAVORITES LIST
test("removeContentFromFavorites for a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // get user 2's story
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);

    const favoritesRes = await removeFromFavoritesFunc(story._id, refreshToken, accessToken);

    const { data } = await favoritesRes.json();

    // CHECK RETURN VALUE
    expect(data.removeContentFromFavorites);

    // CHECK FOR STORY IN USER 2 FAVORITES LIST
    const updatedUser2 = await User.findById(user2._id);
    expect(!updatedUser2.favorites.includes(story._id));
});

// TEST USER 2 ADDS A CHAPTER TO A STORY
test("createChapter for adding a chapter to a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // get user 2's story
    const user2 = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user2.user_content[0]);

    // chapter title
    const chapterTitle = "chapter creation test"

    const createChapterRes = await createChapterFunc(story._id, chapterTitle, refreshToken, accessToken);

    const { data } = await createChapterRes.json();

    // CHECK RETURN VALUE
    expect(data.createChapter);

    // CHECK FOR CHAPTER IN STORY
    const chapter = await Chapter.findById(data.createChapter);
    const updatedStory = await Content.findById(story._id);

    expect(updatedStory.chapters.includes(chapter._id));

    // CHECK CHAPTER FOR CORRECT TITLE
    expect(chapter.chapter_title).toStrictEqual(chapterTitle);
    expect(chapter.series_id).toStrictEqual(story._id);
});

// TEST USER 1 CREATES A COMIC, ADDS A CHAPTER TO A COMIC, DELETES THE CHAPTER, THEN DELETES THE COMIC
test("deleteChapter for deleting a chapter from a comic", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // create a comic under user 1
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent

    // create chapter in comic
    const chapterTitle = "comic chapter 1"
    const createChapterRes = await createChapterFunc(comicId, chapterTitle, refreshToken, accessToken);
    const { data:createChapterData } = await createChapterRes.json();
    const chapterId = createChapterData.createChapter;

    // deletes a chapter from the comic
    const deleteChapterRes = await deleteChapterFunc(createChapterData.createChapter);
    const { data:deleteChapterData } = await deleteChapterRes.json();

    // expect return value
    expect(deleteChapterData.deleteChapter);

    // check if chapter has been removed from Chapter collection
    expect(await Chapter.findById(chapterId)).toStrictEqual(null);

    //check if chapter has been removed from Content
    const updatedComic = await Content.findById(comicId);
    expect(!updatedComic.chapters.includes(chapterId));

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 1 CREATES A COMIC, ADDS A CHAPTER TO A COMIC, EDITS THE CHAPTER, THEN DELETES THE COMIC
test("editChapter for editing a chapter from a comic", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // create a comic under user 1
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // create chapter in comic
    const chapterTitle = "comic chapter 1"
    const createChapterRes = await createChapterFunc(comicId, chapterTitle, refreshToken, accessToken);
    const { data:createChapterData } = await createChapterRes.json();
    const chapterId = createChapterData.createChapter;

    // edits comic data
    const editedValues = {
        chapter_title: "new chapter title",
        num_pages: 2,
        chapter_content: ["a","b"],
        publication_date: Date.now()
    }

    const editChapterRes = await editChapterFunc(chapterId, editedValues, refreshToken, accessToken);
    const { data:editChapterData } = await editChapterRes.json();

    // expect return value
    expect(editChapterData.editChapter).toStrictEqual(chapterId);

    // expect updated chapter values
    const updatedComic = await Chapter.findById(chapterId);
    const updatedValues = {
        chapter_title: updatedComic.chapter_title,
        num_pages: updatedComic.num_pages,
        chapter_content: updatedComic.chapter_content,
        publication_date: new Date(updatedComic.publication_date).getTime()
    }
    expect(updatedValues).toStrictEqual(editedValues)

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 1 CREATES A STORY, ADDS A CHAPTER TO THE STORY, PUBLISHES THE STORY, THEN DELETES THE STORY
test("publishChapter for publishing a chapter from a story", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // create a story under user 1
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create chapter in story
    const chapterTitle = "story chapter 1"
    const createChapterRes = await createChapterFunc(storyId, chapterTitle, refreshToken, accessToken);
    const { data:createChapterData } = await createChapterRes.json();
    const chapterId = createChapterData.createChapter;

    // publishes story chapter
    const publishChapterRes = await publishChapterFunc(chapterId, refreshToken, accessToken);
    const { data:publishChapterData } = await publishChapterRes.json();

    // expect return value
    expect(publishChapterData.publishChapter);

    // expect updated chapter values
    const chapter = await Chapter.findById(chapterId);
    expect(chapter.publication_date != 0);

    // delete story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 2 CREATES A STORY, CREATES A CHARACTER, THEN DELETES THE STORY
test("createCharacter for creating a character in a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // create a story
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create a character
    const testCharacter = {
        character_name: "test character",
        notes: "notes on test character",
        character_image: "image character"
    }
    const story = await Content.findById(storyId)
    const storyboard = await StoryBoard.findById(story.storyboard);
    const createCharacterRes = await createCharacterFunc(storyboard._id, testCharacter, refreshToken, accessToken);
    const { data:createCharacterData } = await createCharacterRes.json();

    // check return value for null values
    expect(createCharacterData.createCharacter);

    // check character values are correct
    const updatedStoryboard = await StoryBoard.findById(story.storyboard);
    const character = updatedStoryboard.characters.find(o => o._id.toString() === createCharacterData.createCharacter.toString());
    const updatedCharacterValues = {
        character_name: character.character_name,
        notes: character.notes,
        character_image: character.character_image
    }
    expect(updatedCharacterValues).toStrictEqual(testCharacter);

    // delete a story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 2 CREATES A STORY, CREATES A CHARACTER, EDITS THE CHARACTER, THEN DELETES THE STORY
test("editCharacter for editing a character in a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // create a story
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create a character
    const testCharacter = {
        character_name: "test character",
        notes: "notes on test character",
        character_image: "image character"
    }
    const story = await Content.findById(storyId)
    const storyboard = await StoryBoard.findById(story.storyboard);
    const createCharacterRes = await createCharacterFunc(storyboard._id, testCharacter, refreshToken, accessToken);
    const { data:createCharacterData } = await createCharacterRes.json();

    // edit character
    const editedValues = {
        character_name: "edited test name",
        notes: "changed notes on test char",
        character_image: "new image"
    }
    const editCharacterRes = await editCharacterFunc(storyboard._id, createCharacterData.createCharacter, editedValues, refreshToken, accessToken);
    const { data:editCharacterData } = await editCharacterRes.json();

    // check return values
    expect(editCharacterData.editCharacter).toStrictEqual(storyboard._id.toString());

    // check edited values
    const updatedStoryboard = await StoryBoard.findById(story.storyboard);
    const character = updatedStoryboard.characters.find(o => o._id.toString() === createCharacterData.createCharacter.toString());
    const updatedCharacterValues = {
        character_name: character.character_name,
        notes: character.notes,
        character_image: character.character_image
    }
    expect(updatedCharacterValues).toStrictEqual(editedValues);

    // delete a story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 2 CREATES A STORY, CREATES A CHARACTER, DELETES THE CHARACTER, THEN DELETES THE STORY
test("deleteCharacter for deleting a character from a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // create a story
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create a character
    const testCharacter = {
        character_name: "test character",
        notes: "notes on test character",
        character_image: "image character"
    }
    const story = await Content.findById(storyId)
    const storyboard = await StoryBoard.findById(story.storyboard);
    const createCharacterRes = await createCharacterFunc(storyboard._id, testCharacter, refreshToken, accessToken);
    const { data:createCharacterData } = await createCharacterRes.json();

    // delete character
    const deleteCharacterRes = await deleteCharacterFunc(storyboard._id, createCharacterData.createCharacter);
    const { data:deleteCharacterData } = await deleteCharacterRes.json();

    // check return values
    expect(deleteCharacterData.deleteCharacter);

    // check that the character no longer exists in storyboard
    const updatedStoryboard = await StoryBoard.findById(story.storyboard);
    const character = updatedStoryboard.characters.find(o => o._id.toString() === createCharacterData.createCharacter.toString());
    expect(!character);

    // delete a story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 2 CREATES A STORY, CREATES A PLOTPOINT, THEN DELETES THE STORY
test("createPlotPoint for creating a plot point in a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // create a story
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create a plot point
    const testPlotpoint = {
        plot_point_name: "plot point",
        notes: "plot notes",
        plot_point_image: "plot image"
    }
    const story = await Content.findById(storyId)
    const storyboard = await StoryBoard.findById(story.storyboard);
    const createPlotPointRes = await createPlotPointFunc(storyboard._id, testPlotpoint, refreshToken, accessToken);
    const { data:createPlotPointData } = await createPlotPointRes.json();

    // check return value for null values
    expect(createPlotPointData.createPlotPoint);

    // check plot point values are correct
    const updatedStoryboard = await StoryBoard.findById(story.storyboard);
    const plotpoint = updatedStoryboard.plot_points.find(o => o._id.toString() === createPlotPointData.createPlotPoint.toString());
    const updatedPlotPointValues = {
        plot_point_name: plotpoint.plot_point_name,
        notes: plotpoint.notes,
        plot_point_image: plotpoint.plot_point_image
    }
    expect(updatedPlotPointValues).toStrictEqual(testPlotpoint);

    // delete a story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 2 CREATES A STORY, CREATES A PLOTPOINT, EDITS THE PLOTPOINT, AND DELETES THE STORY
test("editPlotPoint for editing a plot point in a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // create a story
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create a plot point
    const testPlotpoint = {
        plot_point_name: "plot point",
        notes: "plot notes",
        plot_point_image: "plot image"
    }
    const story = await Content.findById(storyId)
    const storyboard = await StoryBoard.findById(story.storyboard);
    const createPlotPointRes = await createPlotPointFunc(storyboard._id, testPlotpoint, refreshToken, accessToken);
    const { data:createPlotPointData } = await createPlotPointRes.json();

    // edit plot point values
    const editedValues = {
        plot_point_name: "adfsdf",
        notes: "3y54y5y53",
        plot_point_image: "348w34tiuht4"
    }
    const editPlotPointRes = await editPlotPointFunc(storyboard._id, createPlotPointData.createPlotPoint, editedValues, refreshToken, accessToken);
    const { data:editPlotPointData } = await editPlotPointRes.json();

    // check return value
    expect(editPlotPointData.editPlotPoint).toStrictEqual(storyboard._id.toString());

    // check plot point values have changed
    const updatedStoryboard = await StoryBoard.findById(story.storyboard);
    const plotpoint = updatedStoryboard.plot_points.find(o => o._id.toString() === createPlotPointData.createPlotPoint.toString());
    const updatedPlotPointValues = {
        plot_point_name: plotpoint.plot_point_name,
        notes: plotpoint.notes,
        plot_point_image: plotpoint.plot_point_image
    }
    expect(updatedPlotPointValues).toStrictEqual(editedValues);

    // delete a story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 2 CREATES A STORY, CREATES A PLOTPOINT, DELETES A PLOTPOINT, AND DELETES THE STORY
test("deletePlotPoint for deleting a plot point from a story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    // create a story
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // create a plot point
    const testPlotpoint = {
        plot_point_name: "plot point",
        notes: "plot notes",
        plot_point_image: "plot image"
    }
    const story = await Content.findById(storyId)
    const storyboard = await StoryBoard.findById(story.storyboard);
    const createPlotPointRes = await createPlotPointFunc(storyboard._id, testPlotpoint, refreshToken, accessToken);
    const { data:createPlotPointData } = await createPlotPointRes.json();

    // delete a plot point
    const deletePlotPointRes = await deletePlotPointFunc(storyboard._id, createPlotPointData.createPlotPoint, refreshToken, accessToken);
    const { data:deletePlotPointData } = await deletePlotPointRes.json();

    // check return value
    expect(deletePlotPointData.deletePlotPoint);

    // check plot point has been deleted from storyboard
    const updatedStoryboard = await StoryBoard.findById(story.storyboard);
    const plotpoint = updatedStoryboard.plot_points.find(o => o._id.toString() === createPlotPointData.createPlotPoint.toString());
    expect(!plotpoint);

    // delete a story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 1 CREATES A COMIC, A QUERY IS SENT TO REQUEST FOR THE CONTENT, TEST USER 1 THEN DELETES THE COMIC
test("getContentInfo for getting info on a comic", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // send query for comic
    const getContentInfoRes = await getContentInfoFunc(comicId);
    const { data:getContentInfoData } = await getContentInfoRes.json()

    // check return value
    expect(getContentInfoData.getContentInfo._id).toStrictEqual(comicId);

    // delete a comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// TEST USER 1 CREATES A COMIC, CREATES A CHAPTER FOR THE COMIC, A QUERY IS SENT TO REQUEST FOR THE CHAPTER, TEST USER 1 THEN DELETES THE COMIC
test("getContentChapter for getting a comic chapter", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // create chapter in comic
    const chapterTitle = "comic chapter 1"
    const createChapterRes = await createChapterFunc(comicId, chapterTitle, refreshToken, accessToken);
    const { data:createChapterData } = await createChapterRes.json();
    const chapterId = createChapterData.createChapter;

    // send query for chapter
    const getContentChapterRes = await getContentChapterFunc(chapterId);
    const { data:getContentChapterData } = await getContentChapterRes.json();

    // check return value
    expect(getContentChapterData.getContentChapter._id).toStrictEqual(chapterId);

    // delete a comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// getChapters(chapterIDs: [ID] ): [ChapterItem]
// TEST USER 1 CREATES A COMIC, CREATES 2 CHAPTERS FOR THE COMIC(ONE PUBLISHED, ONE UNPUBLISHED), 
// A QUERY IS SENT TO REQUEST FOR THE LIST OF CHAPTERS, TEST USER 1 THEN DELETES THE COMIC
test("getChapters for getting the chapters of a comic", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // create chapter in comic
    const chapterTitle = "comic chapter 1"
    const createChapterRes = await createChapterFunc(comicId, chapterTitle, refreshToken, accessToken);
    const { data:createChapterData } = await createChapterRes.json();
    const chapterId = createChapterData.createChapter;

    // publish chapter 1
    const publishChapterRes = await publishChapterFunc(chapterId, refreshToken, accessToken);
    const { data:publishChapterData } = await publishChapterRes.json();

    // create another chapter in comic
    const chapterTitle2 = "comic chapter 2"
    const createChapterRes2 = await createChapterFunc(comicId, chapterTitle2, refreshToken, accessToken);
    const { data:createChapterData2 } = await createChapterRes2.json();
    const chapterId2 = createChapterData2.createChapter;

    // send query for chapters
    const getChaptersRes = await getChaptersFunc([chapterId, chapterId2]);
    const { data:getChaptersData, errors } = await getChaptersRes.json();

    // check return values
    const chapter1 = await Chapter.findById(chapterId);
    const targetValue = [{
        _id: chapterId,
        chapter_title: chapterTitle,
        publication_date: chapter1.publication_date
    }, {
        _id: chapterId2,
        chapter_title: chapterTitle2,
        publication_date: new Date(0)
    }];
    const actualValue = [{
        _id: getChaptersData.getChapters[0]._id,
        chapter_title: getChaptersData.getChapters[0].chapter_title,
        publication_date: new Date(getChaptersData.getChapters[0].publication_date)
    }, {
        _id: getChaptersData.getChapters[1]._id,
        chapter_title: getChaptersData.getChapters[1].chapter_title,
        publication_date: new Date(getChaptersData.getChapters[1].publication_date)
    }]

    expect(actualValue).toStrictEqual(targetValue);

    // delete a comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// CREATE COMIC WITH MAX VIEWS, QUERY FOR POPULAR CONTENT, DELETE COMIC
test("getPopularContent test for a comic with the most views", async () => {
    //get test user 1
    const user1 = await User.findOne({username: contentTestUser1.username});

    // create test comic
    const mostPopularId = new ObjectId();
    const mostPopularContent = {
      _id: mostPopularId,
      series_title: "this is the most popular comic",
      author: user1._id,
      author_username: user1.username,
      synopsis: "synopsis for a popular comic",
      genres: ["Action"],
      num_chapters: 0,
      chapters: [],
      views: Number.MAX_SAFE_INTEGER,
      num_favorites: 0,
      discussion_post: new ObjectId("624216a0dd90b5c46c5e24d0"),
      current_rating: 5,
      num_of_ratings: 0,
      total_ratings: 0,
      publication_date: 0,
      completed: false,
      cover_image: "most popular cover",
      content_type: "C",
    }

    // save the new content
    const mostPopular = new Content(mostPopularContent);
    await mostPopular.save();

    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // publish content
    await publishContentFunc(mostPopularId, refreshToken, accessToken);

    // query for popular
    const getPopularContentRes = await getPopularContentFunc(mostPopularContent.content_type);
    const { data } = await getPopularContentRes.json();

    // check the top result is the generated comic
    expect(data.getPopularContent[0]._id).toStrictEqual(mostPopularId.toString());

    // delete content

    const deleteContentRes = await deleteContentFunc(mostPopularId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// CREATE COMIC WITH MAX RATING, QUERY FOR TOP RATED, DELETE COMIC
test("getTopRatedContent test for a top rated comic", async () => {
    // //delete conflicting data
    // await Content.deleteMany({current_rating: {$gte:Number.MAX_SAFE_INTEGER}});

    //get test user 1
    const user1 = await User.findOne({username: contentTestUser1.username});

    // create test comic
    const topRatedId = new ObjectId();
    const topRatedContent = {
      _id: topRatedId,
      series_title: "this is the top rated comic",
      author: user1._id,
      author_username: user1.username,
      synopsis: "synopsis for the top rated comic",
      genres: ["Action"],
      num_chapters: 0,
      chapters: [],
      views: 0,
      num_favorites: 0,
      discussion_post: new ObjectId("624216a0dd90b5c46c5e24d0"),
      current_rating: Number.MAX_SAFE_INTEGER,
      num_of_ratings: 0,
      total_ratings: 0,
      publication_date: 0,
      completed: false,
      cover_image: "top rated cover",
      content_type: "C",
    }

    // save the new content
    const topRated = new Content(topRatedContent);
    await topRated.save();

    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    // publish content
    await publishContentFunc(topRatedId, refreshToken, accessToken);

    // query for popular
    const getTopRatedContentRes = await getTopRatedContentFunc(topRatedContent.content_type);
    const { data } = await getTopRatedContentRes.json();

    // check the top result is the generated comic
    expect(data.getTopRatedContent[0]._id).toStrictEqual(topRatedId.toString());

    // delete content
    const deleteContentRes = await deleteContentFunc(topRatedId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// CREATE 5 MOST RECENT COMICS, QUERY FOR MOST RECENT COMICS, DELETE COMICS
test("getRecentContent test for 5 recent comics", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

    let comicIds = []

    // Create 5 comics
    for(let i = 0; i < 5; i++){
        const recentComic = {
            series_title: "recent comic "+i,
            synopsis: "synopsis for a test comic",
            genres: [],
            cover_image: "coverimagefortestcomic",
            content_type: "C"
        }
        const res = await createContentFunc(recentComic, refreshToken, accessToken);
        const { data } = await res.json();
        await Content.findByIdAndUpdate(data.createContent, {publication_date: new Date(3000, 5-i)});
        comicIds.push(data.createContent);
    }

    // query for most recent comics
    const res = await getRecentContentFunc(testComic.content_type);
    const { data } = await res.json();

    for(let i = 0; i < 5; i++){
        const comic = await Content.findById(data.getRecentContent[i]);
        expect(comic._id.toString()).toStrictEqual(comicIds[i].toString());
    }

    // delete 5 comics
    comicIds.forEach(async (id) => {
        const deleteContentRes = await deleteContentFunc(id, refreshToken, accessToken);
        const { data:deleteContentData } = await deleteContentRes.json();
        expect(deleteContentData.deleteContent);
    });
});

// CREATE COMIC, ADD COMIC TO READ LIST, QUERY, DELETE COMIC
test("getReadList for getting read list of user 1", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);
    const { data: loginData } = await loginRes.json();

    // create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // add comic to read list
    await addToReadListFunc(comicId, refreshToken, accessToken);

    // query for read list of user 1
    const getReadListRes = await getReadListFunc(loginData.login._id);
    const { data:getReadListData } = await getReadListRes.json();

    // expect values
    const comic = await Content.findById(comicId);

    const expected_values = [{
        series_title: comic.series_title,
        num_chapters: comic.num_chapters,
        current_rating: comic.current_rating,
        publication_date: comic.publication_date,
        cover_image: comic.cover_image
    }]

    const actual_values = [{
        series_title: getReadListData.getReadList[0].series_title,
        num_chapters: getReadListData.getReadList[0].num_chapters,
        current_rating: getReadListData.getReadList[0].current_rating,
        publication_date: new Date(getReadListData.getReadList[0].publication_date),
        cover_image: getReadListData.getReadList[0].cover_image
    }];

    expect(actual_values).toStrictEqual(expected_values)

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// CREATE COMIC, ADD TO FAVORITES, QUERY, DELETE COMIC
test("getFavorites for getting favorites of user 1", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);
    const { data: loginData } = await loginRes.json();

    // create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // add comic to read list
    await addToFavoritesFunc(comicId, refreshToken, accessToken);

    // query for read list of user 1
    const getFavoritesRes = await getFavoritesFunc(loginData.login._id);
    const { data:getFavoritesData } = await getFavoritesRes.json();

    // expect values
    const comic = await Content.findById(comicId);

    const expected_values = [{
        series_title: comic.series_title,
        num_chapters: comic.num_chapters,
        current_rating: comic.current_rating,
        publication_date: comic.publication_date,
        cover_image: comic.cover_image
    }]

    const actual_values = [{
        series_title: getFavoritesData.getFavorites[0].series_title,
        num_chapters: getFavoritesData.getFavorites[0].num_chapters,
        current_rating: getFavoritesData.getFavorites[0].current_rating,
        publication_date: new Date(getFavoritesData.getFavorites[0].publication_date),
        cover_image: getFavoritesData.getFavorites[0].cover_image
    }];

    expect(actual_values).toStrictEqual(expected_values);

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// CREATE A COMIC, QUERY, DELETE COMIC
// getFilteredContent(genres: [String], releaseYear: DateTime, rating: Int, completionStatus: Boolean, contentType: String): [ContentCard]
test("getFilteredContent between two different pieces of content", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);
    const { data: loginData } = await loginRes.json();

    // create a comic
    const comicFilter = {
        genres: ["Action","Psychological"],
        releaseYear: new Date(3000, 1),
        rating: 999,
        completionStatus: true,
        contentType: "C"
    }

    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    await Content.findByIdAndUpdate(comicId, {
        genres: comicFilter.genres,
        publication_date: comicFilter.releaseYear,
        current_rating: comicFilter.rating,
        completed: comicFilter.completionStatus,
    });

    // query for filters
    const filterRes = await getFilteredContentFunc(comicFilter.genres, 3000, comicFilter.rating, comicFilter.completionStatus, testComic.content_type);
    const { data:filter } = await filterRes.json();

    // check expected values
    const comic = await Content.findById(comicId);
    const expected_values = [{
        series_title: comic.series_title,
        num_chapters: comic.num_chapters,
        current_rating: comic.current_rating,
        publication_date: comic.publication_date,
        cover_image: comic.cover_image
    }]

    const actual_values = [{
        series_title: filter.getFilteredContent[0].series_title,
        num_chapters: filter.getFilteredContent[0].num_chapters,
        current_rating: filter.getFilteredContent[0].current_rating,
        publication_date: new Date(filter.getFilteredContent[0].publication_date),
        cover_image: filter.getFilteredContent[0].cover_image
    }];
    expect(actual_values).toStrictEqual(expected_values)

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);
});

// CREATE COMIC, QUERY FOR CONTENT, DELETE COMIC
test("getMyContent for getting user 1's user content", async () => {
    await registerFunc("getmycontent@email.com", "getmycontentusername", "getmycontent");

    // Log in as getmycontent user 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("getmycontentusername", "getmycontent");
    const { data:loginData } = await loginRes.json()

    // clear out user content
    const user = await User.findByIdAndUpdate(loginData.login._id);

    // create a comic
    const createContentRes = await createContentFunc(testComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;
    const comic = await Content.findById(comicId);

    // query for user content
    const getMyContentRes = await getMyContentFunc(loginData.login._id);
    const { data:contentData, errors } = await getMyContentRes.json();

    // check expected values
    const expected_values = [{
        series_title: comic.series_title,
        num_chapters: comic.num_chapters,
        current_rating: comic.current_rating,
        publication_date: comic.publication_date,
        cover_image: comic.cover_image
    }]
    const actual_values = [{
        series_title: contentData.getMyContent[0].series_title,
        num_chapters: contentData.getMyContent[0].num_chapters,
        current_rating: contentData.getMyContent[0].current_rating,
        publication_date: new Date(contentData.getMyContent[0].publication_date),
        cover_image: contentData.getMyContent[0].cover_image
    }];
    expect(actual_values).toStrictEqual(expected_values);

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);

    // delete user
    await User.deleteOne({email:"getmycontent@email.com"});
})

// CREATE STORY, QUERY FOR STORYBOARD, DELETE STORY
test("getStoryboard for getting a storyboard from a new story", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);
    const { data:loginData } = await loginRes.json()

    // create a story under user 1
    const createContentRes = await createContentFunc(testStory, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const storyId = data.createContent;

    // query for storyboard
    const story = await Content.findById(storyId);
    const storyboardRes = await getStoryboardFunc(story.storyboard);
    const { data:storyboardData } = await storyboardRes.json();

    // delete story
    const deleteContentRes = await deleteContentFunc(storyId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);

    // expect values
    const expected_values = {
        characters: [],
        plot_points: []
    }
    expect(storyboardData.getStoryboard).toStrictEqual(expected_values)
});

// CREATE COMIC, SEARCH FOR COMIC, DELETE COMIC
test("getSearch for searching for a comic", async () => {
    // Log in as test user 1 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);
    const { data:loginData } = await loginRes.json()

    // create a comic
    const searchComic = {
        series_title: "conspicuous title for a comic",
        synopsis: "synopsis for a conspicuous comic",
        genres: [],
        cover_image: "coverimageforconspicuouscomic",
        content_type: "C"
    }
    const createContentRes = await createContentFunc(searchComic, refreshToken, accessToken);
    const { data } = await createContentRes.json();
    const comicId = data.createContent;

    // search for comic
    const getSearchRes = await getSearchFunc("conspicuous");
    const { data:searchData } = await getSearchRes.json()

    const comic = await Content.findById(comicId);

    // delete comic
    const deleteContentRes = await deleteContentFunc(comicId, refreshToken, accessToken);
    const { data:deleteContentData } = await deleteContentRes.json();
    expect(deleteContentData.deleteContent);

    // check expected values
    const expected_values = [{
        series_title: comic.series_title,
        num_chapters: comic.num_chapters,
        current_rating: comic.current_rating,
        publication_date: comic.publication_date,
        cover_image: comic.cover_image
    }]

    const actual_values = [{
        series_title: searchData.getSearch[0].series_title,
        num_chapters: searchData.getSearch[0].num_chapters,
        current_rating: searchData.getSearch[0].current_rating,
        publication_date: new Date(searchData.getSearch[0].publication_date),
        cover_image: searchData.getSearch[0].cover_image
    }];
    expect(actual_values).toStrictEqual(expected_values);
});

// TEST USER 2 DELETES A PUBLISHED STORY 
test("deleteContent for deleting a published story", async () => {
    // Log in as test user 2 
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser2.username, contentTestUser2.password);

    const user = await User.findOne({email: contentTestUser2.email});
    const story = await Content.findById(user.user_content[0]);
    const post = await ForumPost.findById(story.discussion_post);

    const deleteContentRes = await deleteContentFunc(story._id, refreshToken, accessToken);

    // CHECK RETURN VALUE OF MUTATION
    const { data } = await deleteContentRes.json();
    expect(data.deleteContentRes);

    // CHECK DELETION OF CONTENT FROM:
    // STORYBOARDS
    expect(await StoryBoard.findById(story.storyboard)).toStrictEqual(null);
    // FORUMTOPICS
    const topics = await ForumTopic.findById(post.topic);
    expect(!topics.posts.includes(story.discussion_post));
    // FORUMPOSTS
    expect(await ForumPost.findById(story.discussion_post)).toStrictEqual(null);
    // CONTENT
    expect(await Content.findById(story._id)).toStrictEqual(null);
    // USER_CONTENT
    expect(!user.user_content.includes(story._id));
    // CHAPTERS
    expect(await Chapter.findOne({series_id: story._id})).toStrictEqual(null);
});

