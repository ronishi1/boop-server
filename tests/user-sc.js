const loginTokenFunc = async (username, password) => {
    const loginRes = await fetch("https://boop416-server.herokuapp.com/graphql", {
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

    const refreshRegex = /(refresh-token.*?(?=;))/g
    const refreshToken = (loginRes.headers.get('set-cookie')).match(refreshRegex)[0];
    const accessRegex = /(access-token.*?(?=;))/g
    const accessToken = (loginRes.headers.get('set-cookie')).match(accessRegex)[0];

    return {loginRes, refreshToken, accessToken};
}

const registerFunc = async (email, username, password) => {
    const registerRes = await fetch("https://boop416-server.herokuapp.com/graphql", {
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

/* eventually remove loginReq bc loginTokenFunc does the same thing with more functionality*/
module.exports = {
    registerFunc,
    loginTokenFunc,
}