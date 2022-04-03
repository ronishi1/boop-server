require('isomorphic-fetch');

const mongoose = require('mongoose');
require('dotenv').config();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user-model');
const { loginTokenFunc, registerFunc } = require('./user-sc');
const { createContentFunc, publishContentFunc, deleteContentFunc, addToFavoritesFunc } = require('./content-sc');
const { getUserPublishedFunc, getUserFavoritesFunc } = require('./profile-sc');

/*SETUP TEST USER INFO */
const followerInfo = {
    email: "followertest@email.com",
    username: "followertest", 
    password: "followertestpassword"
}
const followedInfo = {
    email: "followedtest@email.com",
    username: "followedtest",
    password: "followedtestpassword"
}
const testComic = {
    series_title: "Test Comic",
    synopsis: "synopsis for a test comic",
    genres: [],
    cover_image: "coverimagetest",
    content_type: "C"
}
const testStory = {
    series_title: "Test Story",
    synopsis: "synopsis for a test story",
    genres: [],
    cover_image: "coverimagetest",
    content_type: "S"
}

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));;

    /*DELETE ANY USERS WITH TEST CRITERIA */
    await User.deleteMany({email: followerInfo.email});
    await User.deleteMany({email: followedInfo.email});
    await User.deleteMany({username: followerInfo.username});
    await User.deleteMany({username: followedInfo.username});

    /*CREATE FOLLOWER USER AND FOLLOWED USER */
    await registerFunc(followerInfo.email, followerInfo.username, followerInfo.password);
    await registerFunc(followedInfo.email, followedInfo.username, followedInfo.password);

    // LOG IN AS FOLLOWED
    const { refreshToken: followedRT, accessToken: followedAT } = await loginTokenFunc(followedInfo.username, followedInfo.password);

    // CREATE A COMIC UNDER FOLLOWED
    const createComicRes = await createContentFunc(testComic ,followedRT, followedAT);
    const { data:createComicData } = await createComicRes.json();

    // PUBLISH COMIC UNDER FOLLOWED
    await publishContentFunc(createComicData.createContent, followedRT, followedAT);

    // CREATE A STORY UNDER FOLLOWED
    await createContentFunc(testStory ,followedRT, followedAT);

    // LOG IN AS FOLLOWER
    const { data, refreshToken: followerRT, accessToken: followerAT } = await loginTokenFunc(followerInfo.username, followerInfo.password);

    // FAVORITE FOLLOWED USER'S COMIC UNDER FOLLOWER
    await addToFavoritesFunc(createComicData.createContent, followerRT, followerAT);

});

afterAll(async () => {
    // LOG IN AS FOLLOWED
    const { refreshToken: followedRT, accessToken: followedAT } = await loginTokenFunc(followedInfo.username, followedInfo.password);
    
    // DELETE CONTENT CREATED BY FOLLOWED USER
    const followed = await User.findOne({username:followedInfo.username});
    for(contentId in followed.user_content){
        await deleteContentFunc(contentId, followedRT, followedAT)
    }

    /*DELETE TEST USERS FROM DB*/
    await User.deleteMany({email: followerInfo.email});
    await User.deleteMany({email: followedInfo.email});

    await mongoose.connection.close().catch(error => console.error(error));;
});

// TEST FOLLOWED USER'S PROFILE
test("getUserProfile", async () => {
    const followedUser = await User.findOne({username: followedInfo.username});

    const res = await fetch("https://boop416-server.herokuapp.com/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getUserProfile(_id: "${followedUser._id}") {
                    username
                }
            }`
        }),
    });
    const { data } = await res.json();

    expect(data.getUserProfile.username).toStrictEqual(followedInfo.username)
});

// QUERY FOR PUBLISHED WORK OF FOLLOWED USER
test("getUserPublished for getting a published comic", async () => {
    //query for published work of user 
    const followed = await User.findOne({email:followedInfo.email});
    const getUserPublishedRes = await getUserPublishedFunc(followed._id);
    const { data,errors } = await getUserPublishedRes.json();

    //check if results are as expected
    const expectedValues = {
        title: testComic.series_title,
        cover_image: testComic.cover_image
    }
    expect(data.getUserPublished[0]).toStrictEqual(expectedValues);

});

//INCOMPLETE GETUSERFAVORITES TEST - SCENARIO: FOLLOWER FAVORITES CONTENT
test("getUserFavorites(_id:ID): [WorkCard]", async () => {
    //query for favorites list of user 
    const follower = await User.findOne({email:followerInfo.email});
    const getUserFavoritesRes = await getUserFavoritesFunc(follower._id);
    const {data} = await getUserFavoritesRes.json();

    //check if results are as expected
    const expectedValues = {
        title: testComic.series_title,
        cover_image: testComic.cover_image
    }
    expect(data.getUserFavorites[0]).toStrictEqual(expectedValues);
});

// //INCOMPLETE GETUSERACTIVITYFEED TEST:
// /**requires scenarios for each type of activity */
// // ACTIVITY TYPE NOT IMPLEMENTED IN RESOLVERS
// test("getUserActivityFeed(_id:ID): [Activity]", async () => {
    
// });

test('Follow User', async () => {
    // Log in follower
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(followerInfo.username, followerInfo.password);

    const follower = await User.findOne({email: followerInfo.email});
    const followed = await User.findOne({email: followedInfo.email});
        
    const following = await fetch("https://boop416-server.herokuapp.com/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                followUser(followID: "${follower._id}")
            }`
        }),
    })

    const { data } = await following.json();

    expect(data.followUser).toStrictEqual(true);
    expect(follower.following.includes(followed._id));
    expect(followed.followers.includes(follower._id));
});

test('Unfollow User', async () => {
    // Log in follower
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(followerInfo.username, followerInfo.password);

    const unfollower = await User.findOne({email: followerInfo.email});
    const unfollowed = await User.findOne({email: followedInfo.email});
    
    const unfollowing = await fetch("https://boop416-server.herokuapp.com/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                unfollowUser(followID: "${unfollowed._id}")
            }`
        }),
    })

    const { data } = await unfollowing.json();

    expect(data.unfollowUser).toStrictEqual(true);
    expect(!unfollower.following.includes(unfollowed._id));
    expect(!unfollowed.followers.includes(unfollower._id));
})
