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

module.exports = {
    loginReq,
    registerReq,
}