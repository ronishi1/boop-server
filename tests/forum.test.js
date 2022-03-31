require('isomorphic-fetch');
const { loginReq, registerReq,createPostFunc,deletePostFunc} = require('./shortcuts');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;



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
        "_id": "6243aecec8dd2ba5a3ca215e"
      },
      {
        "_id": "6243bbc9a10ad7e85f74cccf"
      },
      {
        "_id": "6243bbcca10ad7e85f74ccd5"
      },
      {
        "_id": "6243bbcfa10ad7e85f74ccdb"
      },
      {
        "_id": "6244de1a0dceb55e5759ab64"
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
  topicPost = await createPostFunc("b","b","topic1","delete topic1","6242239f4b2619473abf93b2")
  topicPost2 = await createPostFunc("b","b","topic2","delete topic2","6242239f4b2619473abf93b2")
  topicPost3 = await createPostFunc("b","b","topic3","delete topic3","6242239f4b2619473abf93b2")
      
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

    await deletePostFunc("b","b",topicPost)
    await deletePostFunc("b","b",topicPost2)
    await deletePostFunc("b","b",topicPost3)

})

test('Get Post', async () => {


  holdgetPost = await createPostFunc("b","b","testing","delete soon","624218db4b2619473abf93ab")
          
      
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
    await deletePostFunc("b","b",holdgetPost)
})

test('get My Posts', async () => {
    
    holdPost = await createPostFunc("b","b","testing","delete soon","624218db4b2619473abf93ab")
    holdPost2 = await createPostFunc("b","b","testing2","delete comic tho soon","624216a0dd90b5c46c5e24d0")
    holdPost3 = await createPostFunc("b","b","testing3","delete soon","624218db4b2619473abf93ab")
    holdPost4 = await createPostFunc("b","b","testing4","delete comic again soon","624216a0dd90b5c46c5e24d0")
    holdPost5 = await createPostFunc("b","b","testing5","delete soon","624218db4b2619473abf93ab")

    const loginRes = await loginReq("b", "b");

    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
    

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

    await deletePostFunc("b","b",holdPost)
    await deletePostFunc("b","b",holdPost2)
    await deletePostFunc("b","b",holdPost3)
    await deletePostFunc("b","b",holdPost4)
    await deletePostFunc("b","b",holdPost5)
})

test('Get Recent Posts', async () => {

  recent1 = await createPostFunc("a","a","Oldest","this is old","624218db4b2619473abf93ab")
  recent2 = await createPostFunc("a","a","less old","this is less old","624218db4b2619473abf93ab")
  recent3 = await createPostFunc("a","a","mid old","this is mid old","624218db4b2619473abf93ab")
  recent4 = await createPostFunc("a","a","less fresh","this is less fresh","624218db4b2619473abf93ab")
  recent5 = await createPostFunc("a","a","Freshest","this is fresh","624218db4b2619473abf93ab")



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

  await deletePostFunc("a","a",recent5)
  await deletePostFunc("a","a",recent4)
  await deletePostFunc("a","a",recent3)
  await deletePostFunc("a","a",recent2)
  await deletePostFunc("a","a",recent1)

})

let holdrecent

test('Create Post', async () => {
  const sampleReturn = {
    "_id": "62460cbedab0cf6c79ab53ff"
  }

  const loginRes = await loginReq("a", "a");

  const refreshRegex = /(refresh-token.*?(?=;))/g
  const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
  const accessRegex = /(access-token.*?(?=;))/g
  const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
  
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

  const loginRes = await loginReq("a", "a");

  const refreshRegex = /(refresh-token.*?(?=;))/g
  const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
  const accessRegex = /(access-token.*?(?=;))/g
  const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
  
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


// test('Create Reply', async () => {

//   const loginRes = await loginReq("a", "a");

//   const refreshRegex = /(refresh-token.*?(?=;))/g
//   const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
//   const accessRegex = /(access-token.*?(?=;))/g
//   const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
  
//     const updating = await fetch("http://localhost:4000/graphql", {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//             'cookie': [
//                 `${refreshToken}` + "; " + `${accessToken}`
//             ]
//         },

//         body: JSON.stringify({
//             query: `mutation {
//                 createReply(postID: "`+holdrecent+`",content:"I like this post")
//             }`
//         }),
        
//     })
//     const upResp = await updating.json()
//     //console.log(upResp)
//     expect((upResp.data.createReply).len).toStrictEqual((holdrecent).len)
// })


// test('Edit Reply', async () => {
//   await mongoose.connect(process.env.MONGO_URI, 
//     { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));;
  
//   const postObjectId = new ObjectId(holdrecent);
//   const foundPost = await ForumPost.findOne({_id:postObjectId});



//   const loginRes = await loginReq("a", "a");

//   const refreshRegex = /(refresh-token.*?(?=;))/g
//   const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
//   const accessRegex = /(access-token.*?(?=;))/g
//   const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
  
//     const updating = await fetch("http://localhost:4000/graphql", {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//             'cookie': [
//                 `${refreshToken}` + "; " + `${accessToken}`
//             ]
//         },

//         body: JSON.stringify({
//             query: `mutation {
//                 editReply(postID: "`+holdrecent+`",content:"I dont like this post", replyID: "`+holdreply+`")
//             }`
//         }),
        
//     })
//     const upResp = await updating.json()
//     //console.log(upResp)

//     expect(upResp.data.editReply).toStrictEqual(holdrecent)
// })


test('Delete Post', async () => {

  const loginRes = await loginReq("a", "a");

  const refreshRegex = /(refresh-token.*?(?=;))/g
  const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
  const accessRegex = /(access-token.*?(?=;))/g
  const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];
  
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