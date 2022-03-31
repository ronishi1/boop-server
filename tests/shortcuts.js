const loginReq = async (username, password) => {
    const loginRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "${username}", password: "${password}") {
                    _id
                }
            }`
        }),
    });

    return loginRes;
}

const registerReq = async (email, username, password) => {
    const registerRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                register(email: "${email}", username: "${username}", password: "${password}") {
                    username
                }
            }`
        }),
    });

    return registerRes;
}

const createPostFunc = async(username,password,title,content,topicId) => {
    const loginRes = await loginReq(username, password);

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

const deletePostFunc = async(username,password,postId) => {
    const loginRes = await loginReq(username, password);

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
                  deletePost(postID:"${postId}")
              }`
          }),
      })
      const upResp = await updating.json()
      return upResp
}

module.exports = {
    loginReq,
    registerReq,
    createPostFunc,
    deletePostFunc
}