require('isomorphic-fetch');

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

test('Get Recent Posts', async () => {
    const recentReturn = [
        {
            "_id": "62450af504ebb09385e639a2"
        },
        {
            "_id": "62450ab404ebb09385e6399c"
        },
        {
            "_id": "62450a8f04ebb09385e63996"
        },
        {
            "_id": "62450a4304ebb09385e63990"
        },
        {
            "_id": "62450a2613d31f6e07ef4e5a"
        }
      ]
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


    expect(upResp.data.getRecentPosts).toStrictEqual(recentReturn)
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
          },
          {
            "_id": "62450a2613d31f6e07ef4e5a"
          },
          {
            "_id": "62450a4304ebb09385e63990"
          },
          {
            "_id": "62450a8f04ebb09385e63996"
          },
          {
            "_id": "62450ab404ebb09385e6399c"
          },
          {
            "_id": "62450af504ebb09385e639a2"
          }
      ]
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


    expect(upResp.data.getOldestPosts).toStrictEqual(oldestReturn)
})

test('Get Most Replied Posts', async () => {
    const repliedrReturn = [
        { 
        "_id": "62450ab404ebb09385e6399c",
        "num_replies": 3
      },
      {
        "_id": "62450af504ebb09385e639a2",
        "num_replies": 3
      },
      {
        "_id": "62450a2613d31f6e07ef4e5a",
        "num_replies": 1
      },
      {
        "_id": "62450a4304ebb09385e63990",
        "num_replies": 1
      },
      {
        "_id": "62450a8f04ebb09385e63996",
        "num_replies": 1
      },
      {
        "_id": "6243aecec8dd2ba5a3ca215e",
        "num_replies": 0
      },
      {
        "_id": "6243bbc9a10ad7e85f74cccf",
        "num_replies": 0
      },
      {
        "_id": "6243bbcca10ad7e85f74ccd5",
        "num_replies": 0
      },
      {
        "_id": "6243bbcfa10ad7e85f74ccdb",
        "num_replies": 0
      },
      {
        "_id": "6244de1a0dceb55e5759ab64",
        "num_replies": 0
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


    expect(upResp.data.getMostRepliedPosts).toStrictEqual(repliedrReturn)
})

test('Get Topic Posts', async () => {
    const topicReturn = [
        {
            "_id": "6244de1a0dceb55e5759ab64"
          }
      ]
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


    expect(upResp.data.getTopicPosts).toStrictEqual(topicReturn)
})

test('Get Post', async () => {
    const postReturn = {"_id": "6244de1a0dceb55e5759ab64"}
          
      
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getPost(postId: "6244de1a0dceb55e5759ab64") {
                    _id
                }
            }`
        }),
    })

    const upResp = await response.json()


    expect(upResp.data.getPost).toStrictEqual(postReturn)
})

// test('get My Posts', async () => {
//     const registerReturn = 'Will'
//     const response = await fetch("http://localhost:4000/graphql", {
//         method: 'POST',
//         headers: {'Content-Type' : 'application/json'},
//         body: JSON.stringify({
//             query: `mutation {
//                 register(email: "TestingFromJes", username: "Will", password: "Rock") {
//                     username
//                 }
//             }`
//         }),
//     })
//     const resp = await response.json()
//     return expect(resp.data.register.username).toStrictEqual(registerReturn);
// })
