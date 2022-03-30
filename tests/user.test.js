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

test('registering account', async () => {
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
                register(email: "TestingFromJes", username: "WillSmi", password: "ChrisRock") {
                    username
                }
            }`
        }),
    })
    const resp = await response.json()
    const message = resp.errors[0].message
    // return expect(resp.data.register.username)
    // console.log(data)
    // console.log(await response.json().data)
    // return expect(respnse.data)
    return expect(resp.errors[0].message).toStrictEqual(registerReturn);
 
})