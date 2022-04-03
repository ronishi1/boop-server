const createPostFunc = async(title,content,topicId,refreshToken,accessToken) => {
      const updating = await fetch("https://boop416-server.herokuapp.com/graphql", {
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
                      title: "${title}"
                      content: "${content}"
                      topic_ID: "${topicId}"
                  })
              }`
          }),
      })
      const upResp = await updating.json()
      //console.log(upResp.data.createPost)
      return upResp.data.createPost
}

const deletePostFunc = async(postId,refreshToken,accessToken) => {
      const updating = await fetch("https://boop416-server.herokuapp.com/graphql", {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/json',
              'cookie': [
                  `${refreshToken}` + "; " + `${accessToken}`
              ]
          },
  
          body: JSON.stringify({
              query: `mutation {
                  deletePost(postID:"${postId}")
              }`
          }),
      })
      const upResp = await updating.json()
      return upResp
}

/* eventually remove loginReq bc loginTokenFunc does the same thing with more functionality*/
module.exports = {
    createPostFunc,
    deletePostFunc,
}