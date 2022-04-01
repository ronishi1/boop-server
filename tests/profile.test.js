require('isomorphic-fetch');

const mongoose = require('mongoose');
require('dotenv').config();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user-model');
const { loginTokenFunc, registerFunc } = require('./shortcuts');

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
    cover_image: "",
    content_type: "C"
}

const testStory = {
    series_title: "Test Story",
    synopsis: "synopsis for a test story",
    genres: [],
    cover_image: "",
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
});

afterAll(async () => {
    /*DELETE TEST USERS FROM DB*/
    await User.deleteMany({email: followerInfo.email});
    await User.deleteMany({email: followedInfo.email});
    await mongoose.connection.close().catch(error => console.error(error));;
});

test("getUserProfile", async () => {
    const followedUser = await User.findOne({username: followedInfo.username});

    const res = await fetch("http://localhost:4000/graphql", {
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

//INCOMPLETE GETUSERPUBLISHED TEST - SCENARIO: FOLLOWED USER CREATES CONTENT
test("getUserPublished(_id:ID): [WorkCard]", async () => {
    const followedUser = await User.findOne({username: followedInfo.username});

    //log in as followed
    //create a comic IN BEFOREALL + SAVE GLOBALLY
    //create a story IN BEFOREALL + SAVE GLOBALLY

    const res = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getUserPublished(_id: "${followedUser._id}") {
                    title
                }
            }`
        }),
    });

    const { data } = await res.json();
    //check if results are as expected
    expect(data);
});

//INCOMPLETE GETUSERFAVORITES TEST - SCENARIO: FOLLOWER FAVORITES CONTENT
test("getUserFavorites(_id:ID): [WorkCard]", async () => {
    //log in as follower
    //add comic+story made by followed to follower's favorites list
    //query for follower's favorites
    //expect statement

});

//INCOMPLETE GETUSERACTIVITYFEED TEST:
/**requires scenarios for each type of activity */
test("getUserActivityFeed(_id:ID): [Activity]", async () => {
    //log in as follower
    //create content
});

test('Follow User', async () => {
    // Log in follower
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc(followerInfo.username, followerInfo.password);

    const follower = await User.findOne({email: followerInfo.email});
    const followed = await User.findOne({email: followedInfo.email});
        
    const following = await fetch("http://localhost:4000/graphql", {
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
    
    const unfollowing = await fetch("http://localhost:4000/graphql", {
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
