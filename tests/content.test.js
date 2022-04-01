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
    createChapterFunc, } = require("./content-sc");

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
        genres: ["Action"],
        cover_image: "newcoverimage"
    }
    
    // SEND REQUEST TO EDIT STORY
    const editContentRes = await editContentFunc(story._id, editedValues, refreshToken, accessToken);

    // CHECK RETURN VALUE
    const { data } = await editContentRes.json();
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

// // TEST USER 1 CREATES A COMIC, ADDS A CHAPTER TO A COMIC, DELETES THE CHAPTER, THEN DELETES THE COMIC
// test("deleteChapter for deleting a chapter from a comic", async () => {
//     // Log in as test user 1 
//     const { loginRes, refreshToken, accessToken } = await loginTokenFunc(contentTestUser1.username, contentTestUser1.password);

//     // create a comic under user 1

//     // add chapter to a comic

//     // deletes a chapter from the comic

//     // expect values

//     // delete comic

//     // get user 1's chapter
//     const user1 = await User.findOne({email: contentTestUser1.email});
//     const comic = await Content.findById(user1.user_content[0]);

//     // chapter title
//     const chapterTitle = "chapter creation test"

//     const deleteChapterRes = await fetch("http://localhost:4000/graphql", {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//             'cookie': [
//                 `${refreshToken}` + "; " + `${accessToken}`
//             ]
//         },
//         body: JSON.stringify({
//             query: `mutation {
//                 createChapter(contentID: "${story._id}", chapter_title: "${chapterTitle}")
//             }`
//         }),
//     });
// });

// editChapter(chapterID: ID, chapterInput: ChapterInput): ID

// publishChapter(chapterID:ID): Boolean
// createCharacter(storyboardID: ID, characterInput: CharacterInput): ID
// editCharacter(storyboardID: ID, characterInput: CharacterInput): ID
// deleteCharacter(storyboardID: ID, characterID: ID): Boolean
// createPlotPoint(storyboardID: ID, plotpointInput: PlotPointInput): ID
// editPlotPoint(storyboardID: ID, plotpointInput: PlotPointInput): ID
// deletePlotPoint(storyboardID: ID, plotpointID: ID): Boolean

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

