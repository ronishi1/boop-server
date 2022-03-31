require('isomorphic-fetch');

const mongoose = require('mongoose');
require('dotenv').config();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user-model');
const { loginReq, registerReq } = require('./shortcuts');

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

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));;

    /*DELETE ANY USERS WITH TEST CRITERIA */
    await User.deleteMany({email: "followertest@email.com"});
    await User.deleteMany({email: "followedtest@email.com"});
    await User.deleteMany({username: "followertest"});
    await User.deleteMany({username: "followedtest"});

    /*CREATE FOLLOWER USER AND FOLLOWED USER */
    await registerReq(followerInfo.email, followerInfo.username, followerInfo.password);
    await registerReq(followedInfo.email, followedInfo.username, followedInfo.password);
});

afterAll(async () => {
    /*DELETE TEST USERS FROM DB*/
    await User.deleteMany({email: "followertest@email.com"});
    await User.deleteMany({email: "followedtest@email.com"});
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
    })
    const { data } = await res.json();

    expect(data.getUserProfile.username).toStrictEqual(followedInfo.username)
});

test('Follow User', async () => {
    // Log in follower
    const loginRes = await loginReq(followerInfo.username, followerInfo.password);
    const { data: loginResData } = await loginRes.json();

    const follower = await User.findById(new ObjectId(loginResData.login._id));
    const followed = await User.findOne({email: followedInfo.email});
    
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
        
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
    const loginRes = await loginReq(followerInfo.username, followerInfo.password);
    const { data: loginResData } = await loginRes.json();

    const unfollower = await User.findById(new ObjectId(loginResData.login._id));
    const unfollowed = await User.findOne({email: followedInfo.email});
    
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
        
    
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
