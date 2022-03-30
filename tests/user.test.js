require('isomorphic-fetch');

// test('registering account', async () => {
//     // The result we're expecting
//     const getPostReturn = {
//         "getPost": {
//             "title": "My Post Games",
//             "content": "Hello this is my post about games"
//         }
//     };
//     return await fetch("http://localhost:4000/graphql", {
//         method: 'POST',
//         headers: {'Content-Type' : 'application/json'},
//         // Query we're sending to GraphQL API
//         body: JSON.stringify({
//             query: `{
//                 getPost(postId: "6243aecec8dd2ba5a3ca215e") {
//                     title
//                     content
//                 }
//             }`
//         }),
//     })
//     .then(res => res.json())
//     .then(res => expect(res.data).toStrictEqual(registerReturn));
// })

// test('registering account', async () => {
//     // The result we're expecting
//     const registerReturn = 'Email Already Exists'
//     // Get the response, the data could be in resp.data or it could return an error
//     //  Modify your tests accordingly 
//     const response = await fetch("http://localhost:4000/graphql", {
//         method: 'POST',
//         headers: {'Content-Type' : 'application/json'},
//         // Query we're sending to GraphQL API
//         body: JSON.stringify({
//             query: `mutation {
//                 register(email: "asddsadsa", username: "cookies", password: "ChrisRock") {
//                     username
//                 }
//             }`
//         }),
//     })
//     const resp = await response.json()
//     // const message = resp.errors[0].message
//     // return expect(resp.data.register.username)
//     // console.log(data)
//     // console.log(await response.json().data)
//     // return expect(respnse.data)
//     return expect(resp.errors[0].message).toStrictEqual(registerReturn);
 
// })



test('logging in account', async () => {
    // The result we're expecting
    const registerReturn = 'Email Already Exists'
    // Get the response, the data could be in resp.data or it could return an error
    //  Modify your tests accordingly 
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        // Query we're sending to GraphQL API
        body: JSON.stringify({
            query: `mutation {
                login(username: "Will", password: "Rock") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    // const refreshToken = response.headers
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];

    // console.log(response.headers[0])
    

    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        userId: "TESTINGJESTING",
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        // Query we're sending to GraphQL API
        body: JSON.stringify({
            query: `mutation {
                updateUsername(username: "Chris")
            }`
        }),
    })
    const upResp = await updating.json()
    console.log(upResp)
    // const message = resp.errors[0].message
    // return expect(resp.data.register.username)
    // console.log(data)
    // console.log(await response.json().data)
    // return expect(respnse.data)
    // return expect(resp.errors[0].message).toStrictEqual(registerReturn);
 
})