require('isomorphic-fetch');
const { loginTokenFunc } = require('./user-sc');
const {createPostFunc, deletePostFunc} = require("./forum-sc")
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const ForumPost = require('../models/forum-post-model');
const User = require('../models/user-model');
require('dotenv').config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));;

    // delete all posts in account b
    const b = await User.findOne({username:"b"});
    b.forum_posts = [];
    await b.save();

})

afterAll(async () => {
    await mongoose.connection.close().catch(error => console.error(error));;
});


test('Get General Posts', async () => {
    const generalReturn = [
        {
            "_id": "6242195e4b2619473abf93ae"
          },
          {
            "_id": "6242197c4b2619473abf93af"
          },
          {
            "_id": "624219954b2619473abf93b0"
          }
      ]
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getCategoryPosts(category: General) {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()
    //console.log(upResp.data.getGeneralPosts)

    expect(upResp.data.getCategoryPosts).toStrictEqual(generalReturn)
})

test('Get Comic Posts', async () => {
    const comicReturn = [
        {
            "_id": "6240df65172c648d223659cf"
          },
          {
            "_id": "624216a0dd90b5c46c5e24d0"
          },
          {
            "_id": "624217bddd90b5c46c5e24d1"
          }
      ]
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getCategoryPosts(category: Comics) {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()


    expect(upResp.data.getCategoryPosts).toStrictEqual(comicReturn)
})

test('Get Story Posts', async () => {
    const storyReturn = [
        {
            "_id": "624217ffdd90b5c46c5e24d3"
          },
          {
            "_id": "624218db4b2619473abf93ab"
          },
          {
            "_id": "624218f04b2619473abf93ac"
          }
      ]
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getCategoryPosts(category: Stories) {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()


    expect(upResp.data.getCategoryPosts).toStrictEqual(storyReturn)
})

test('Get Popular Posts', async () => {
    const poplularReturn = [
        {
            "_id": "62450af504ebb09385e639a2",
            "views": 100
          },
          {
            "_id": "62450ab404ebb09385e6399c",
            "views": 50
          },
          {
            "_id": "6243aecec8dd2ba5a3ca215e",
            "views": 25
          },
          {
            "_id": "6244de1a0dceb55e5759ab64",
            "views": 22
          },
          {
            "_id": "62450a8f04ebb09385e63996",
            "views": 15
          }
      ]
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getPopularPosts {
                    _id
                    views
                }
            }`
        }),
    })

    const upResp = await response.json()


    expect(upResp.data.getPopularPosts).toStrictEqual(poplularReturn)
})

test('Get Oldest Posts', async () => {
    const oldestReturn = [
      {
        "_id": "624669bb7e0ae5a8147739be"
      },
      {
        "_id": "624669d07e0ae5a8147739c4"
      },
      {
        "_id": "624669d97e0ae5a8147739ca"
      },
      {
        "_id": "624669df7e0ae5a8147739d0"
      },
      {
        "_id": "624669e77e0ae5a8147739d6"
      }]
      
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getOldestPosts {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()

    expect(upResp.data.getOldestPosts.slice(0,5)).toStrictEqual(oldestReturn)
})

test('Get Most Replied Posts', async () => {
    const repliedrReturn = [
      {
        "_id": "62450af504ebb09385e639a2",
        "num_replies": 7
      },
      {
        "_id": "62460cbedab0cf6c79ab53ff",
        "num_replies": 6
      },
      {
        "_id": "62450ab404ebb09385e6399c",
        "num_replies": 3
      }
    ]
        
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getMostRepliedPosts {
                    _id
                    num_replies
                }
            }`
        }),
    })

    const upResp = await response.json()


    expect(upResp.data.getMostRepliedPosts.slice(0,3)).toStrictEqual(repliedrReturn)
})

test('Get Topic Posts', async () => {
    const { loginRes, refreshToken, accessToken} = await loginTokenFunc("b","b");
    topicPost = await createPostFunc("topic1","delete topic1","6242239f4b2619473abf93b2",refreshToken,accessToken);
    topicPost2 = await createPostFunc("topic2","delete topic2","6242239f4b2619473abf93b2",refreshToken,accessToken);
    topicPost3 = await createPostFunc("topic3","delete topic3","6242239f4b2619473abf93b2",refreshToken,accessToken);
      
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getTopicPosts(topicId: "6242239f4b2619473abf93b2") {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()
    const lenData = upResp.data.getTopicPosts.length
    //console.log(lenData)
    expect(upResp.data.getTopicPosts[lenData-3]._id).toStrictEqual(topicPost)
    expect(upResp.data.getTopicPosts[lenData-2]._id).toStrictEqual(topicPost2)
    expect(upResp.data.getTopicPosts[lenData-1]._id).toStrictEqual(topicPost3)

    await deletePostFunc(topicPost,refreshToken, accessToken)
    await deletePostFunc(topicPost2,refreshToken, accessToken)
    await deletePostFunc(topicPost3,refreshToken, accessToken)

})

test('Get Post', async () => {

    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("b","b");
    holdgetPost = await createPostFunc("testing","delete soon","624218db4b2619473abf93ab", refreshToken, accessToken);
          
      
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getPost(postId: "${holdgetPost}") {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()


    expect(upResp.data.getPost._id).toStrictEqual(holdgetPost)
    await deletePostFunc(holdgetPost,refreshToken, accessToken)
})

test('get My Posts', async () => {
    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("b", "b");
    
    holdPost = await createPostFunc("testing","delete soon","624218db4b2619473abf93ab",refreshToken,accessToken)
    holdPost2 = await createPostFunc("testing2","delete comic tho soon","624216a0dd90b5c46c5e24d0",refreshToken,accessToken)
    holdPost3 = await createPostFunc("testing3","delete soon","624218db4b2619473abf93ab",refreshToken,accessToken)
    holdPost4 = await createPostFunc("testing4","delete comic again soon","624216a0dd90b5c46c5e24d0",refreshToken,accessToken)
    holdPost5 = await createPostFunc("testing5","delete soon","624218db4b2619473abf93ab",refreshToken,accessToken)


    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `query {
                getMyPosts{
                    _id
                }
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.getMyPosts[0]._id).toStrictEqual(holdPost)
    expect(upResp.data.getMyPosts[1]._id).toStrictEqual(holdPost2)
    expect(upResp.data.getMyPosts[2]._id).toStrictEqual(holdPost3)
    expect(upResp.data.getMyPosts[3]._id).toStrictEqual(holdPost4)
    expect(upResp.data.getMyPosts[4]._id).toStrictEqual(holdPost5)

    await deletePostFunc(holdPost,refreshToken, accessToken)
    await deletePostFunc(holdPost2,refreshToken, accessToken)
    await deletePostFunc(holdPost3,refreshToken, accessToken)
    await deletePostFunc(holdPost4,refreshToken, accessToken)
    await deletePostFunc(holdPost5,refreshToken, accessToken)
})

test('Get Recent Posts', async () => {

    const { logineRes, refreshToken, accessToken } = await loginTokenFunc("a","a")

    recent1 = await createPostFunc("Oldest","this is old","624218db4b2619473abf93ab",refreshToken, accessToken)
    recent2 = await createPostFunc("less old","this is less old","624218db4b2619473abf93ab",refreshToken, accessToken)
    recent3 = await createPostFunc("mid old","this is mid old","624218db4b2619473abf93ab",refreshToken, accessToken)
    recent4 = await createPostFunc("less fresh","this is less fresh","624218db4b2619473abf93ab",refreshToken, accessToken)
    recent5 = await createPostFunc("Freshest","this is fresh","624218db4b2619473abf93ab",refreshToken, accessToken)



    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getRecentPosts {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()

    //console.log(String(holdrecent))
    expect(upResp.data.getRecentPosts[0]._id).toStrictEqual(recent5)
    expect(upResp.data.getRecentPosts[1]._id).toStrictEqual(recent4)
    expect(upResp.data.getRecentPosts[2]._id).toStrictEqual(recent3)
    expect(upResp.data.getRecentPosts[3]._id).toStrictEqual(recent2)
    expect(upResp.data.getRecentPosts[4]._id).toStrictEqual(recent1)

    await deletePostFunc(recent5,refreshToken, accessToken)
    await deletePostFunc(recent4,refreshToken, accessToken)
    await deletePostFunc(recent3,refreshToken, accessToken)
    await deletePostFunc(recent2,refreshToken, accessToken)
    await deletePostFunc(recent1,refreshToken, accessToken)

    })

let holdrecent

test('Create Post', async () => {
    const sampleReturn = {
        "_id": "62460cbedab0cf6c79ab53ff"
    }

    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `mutation {
                createPost(forumPost:{
                    title: "I cant wait"
                    content: "Im sitting here waiting"
                    topic_ID: "624218f04b2619473abf93ac"
                })
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)
    holdrecent = upResp.data.createPost

    expect((upResp.data.createPost).len).toStrictEqual((sampleReturn).len)
})


test('Edit Post', async () => {

    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `mutation {
                editPost(postID: "`+holdrecent+`",content:"This is edited")
            }`
        }),
        
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.editPost).toStrictEqual(holdrecent)
})


test('Create Reply', async () => {

    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `mutation {
                createReply(postID: "`+holdrecent+`",content:"I like this post")
            }`
        }),
        
    })
    const upResp = await updating.json()
    //console.log(upResp)
    expect((upResp.data.createReply).len).toStrictEqual((holdrecent).len)
})
//let holdReply

test('Edit Reply', async () => {
  const postObjectId = new ObjectId(holdrecent);
  const foundPost = await ForumPost.findOne({_id:postObjectId});

  //console.log(foundPost)
  const replyIDhold = foundPost.replies[0]._id
  //holdReply=replyIDhold

  const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `mutation {
                editReply(postID: "`+holdrecent+`",content:"I dont like this post", replyID: "`+replyIDhold+`")
            }`
        }),
        
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.editReply).toStrictEqual(holdrecent)
})

test('Get Replies To My Post', async () => {

    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `query {
                getRepliesToMyPost{
                  post
                }
            }`
        }),
        
    })

    const upResp = await updating.json()
    //console.log(upResp)
    const lenData = upResp.data.getRepliesToMyPost.length

    expect(upResp.data.getRepliesToMyPost[lenData-1].post).toStrictEqual(holdrecent)


})


test('Delete Reply', async () => {
  const postObjectId = new ObjectId(holdrecent);
  const foundPost = await ForumPost.findOne({_id:postObjectId});

  //console.log(foundPost)
  const replyIDhold = foundPost.replies[0]._id

  const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `mutation {
                deleteReply(postID: "`+holdrecent+`", replyID: "`+replyIDhold+`")
            }`
        }),
        
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.deleteReply).toBeTruthy()
})



test('Delete Post', async () => {

    const { loginRes, refreshToken, accessToken } = await loginTokenFunc("a", "a");
  
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },

        body: JSON.stringify({
            query: `mutation {
                deletePost(postID:"`+holdrecent+`")
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.deletePost).toBeTruthy()
})