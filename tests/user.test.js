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

test('Registering Account', async () => {
    // The result we're expecting
    const registerReturn = 'Will'
    // Get the response, the data could be in resp.data or it could return an error
    //  Modify your tests accordingly 
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        // Query we're sending to GraphQL API
        body: JSON.stringify({
            query: `mutation {
                register(email: "TestingFromJes", username: "Will", password: "Rock") {
                    username
                }
            }`
        }),
    })
    const resp = await response.json()
    // const message = resp.errors[0].message
    // return expect(resp.data.register.username)
    // console.log(data)
    // console.log(await response.json().data)
    // return expect(respnse.data)
    return expect(resp.data.register.username).toStrictEqual(registerReturn);
 
})

test('Registering Account ERROR: Email Already Exists', async () => {
    const registerReturn = 'Email Already Exists'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
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
    return expect(resp.errors[0].message).toStrictEqual(registerReturn);
 
})

test('Registering Account ERROR: Username Already Exists', async () => {

    const registerReturn = 'Username Already Exists' 
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                register(email: "notWillSmith", username: "Will", password: "ChrisRock2") {
                    username
                }
            }`
        }),
    })
    const resp = await response.json()
    const message = resp.errors[0].message
    return expect(resp.errors[0].message).toStrictEqual(registerReturn);
 
})

test('Login', async () => {

    const loginReturn = 'Will'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        credentials: "include",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Will",password:"Rock") {
                    username
                }
            }`
        }),
    })
    const resp = await response.json()
    //console.log(response)
    return expect(resp.data.login.username).toStrictEqual(loginReturn);
    
})

test('Login ERROR: Invalid Username', async () => {
    const loginReturn = 'Invalid Username'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        credentials: "include",
        headers: {'Content-Type' : 'application/json'},

        body: JSON.stringify({
            query: `mutation {
                login(username: "aaaaaaaaaaaaaa",password:"Rock") {
                    username
                }
            }`
        }),
    })
    const resp = await response.json()
    return expect(resp.errors[0].message).toStrictEqual(loginReturn);
    
})

test('Login ERROR: Invalid Password', async () => {
    const loginReturn = 'Invalid Password'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        credentials: "include",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Will",password:"b") {
                    username
                }
            }`
        }),
    })
    const resp = await response.json()
    return expect(resp.errors[0].message).toStrictEqual(loginReturn);
    
})

test('Update Username ERROR: Username Already Exists', async () => {
    const loginReturn = 'Username Already Exists'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Will", password: "Rock") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updateUsername(username: "Will")
            }`
        }),
    })
    const upResp = await updating.json()
    expect(upResp.data.updateUsername).toBeFalsy()
 
})

test('Update Username', async () => {
    const registerReturn = 'Email Already Exists'
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
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                updateUsername(username: "Chris")
            }`
        }),
    })
    const upResp = await updating.json()
    expect(upResp.data.updateUsername).toBeTruthy()
 
})

test('Get Current User', async () => {
    const currentReturn = 'Chris'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Rock") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                getCurrentUser{
                    username
                }
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.getCurrentUser.username).toStrictEqual(currentReturn)
 
})

test('Update Password ERROR: Invalid Password', async () => {
    const registerReturn = 'Invalid Password'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Rock") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updatePassword(oldPassword: "Rock2", newPassword: "Smith")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.updatePassword).toBeFalsy()
 
})

test('Update Password ', async () => {
    const registerReturn = 'Invalid Password'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Rock") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updatePassword(oldPassword: "Rock", newPassword: "Smith")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.updatePassword).toBeTruthy()
 
})

test('Password Reset ERROR: Email Not Registered', async () => {
    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },

        body: JSON.stringify({
            query: `mutation {
                passwordReset(email: "doesntexist@email.com", newPassword: "Smith")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.passwordReset).toBeFalsy()
 
})

test('Password Reset', async () => {

    const updating = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },

        body: JSON.stringify({
            query: `mutation {
                passwordReset(email: "TestingFromJes", newPassword: "Smith")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.passwordReset).toBeTruthy()
 
})


test('Update Email ERROR: Email Already Exists', async () => {
    const registerReturn = 'Invalid Password'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Smith") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updateEmail(newEmail: "example.example.com", password: "Smith")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.updateEmail).toBeFalsy()
 
})

test('Update Email ERROR: Invalid Password', async () => {
    const registerReturn = 'Invalid Password'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Smith") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updateEmail(newEmail: "TestingfromJes", password: "Smith2")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.updateEmail).toBeFalsy()
 
})

test('Update Email ', async () => {
    const registerReturn = ''
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Smith") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updateEmail(newEmail: "TestingfromJest", password: "Smith")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.updateEmail).toBeTruthy()
 
})

test('Update Bio ', async () => {
    const registerReturn = ''
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Smith") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                updateBio(newBio: "Here's the new Bio")
                
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.updateBio).toBeTruthy()
 
})


test('Delete Account', async () => {
    const registerReturn = 'Email Already Exists'
    const response = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `mutation {
                login(username: "Chris", password: "Smith") {
                    username
                }
            }`
        }),
    })
    
    const resp = await response.json()
    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (response.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (response.headers.get('set-cookie')).match(accessRegex)[0];
    

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
                deleteAccount
            }`
        }),
    })
    const upResp = await updating.json()
    //console.log(upResp)

    expect(upResp.data.deleteAccount).toBeTruthy()
 
})


