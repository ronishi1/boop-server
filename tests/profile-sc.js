const getUserPublishedFunc = async (userId) => {
    const getUserPublishedRes = await fetch("https://boop416-server.herokuapp.com/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getUserPublished(_id:"${userId}") {
                    title
                    cover_image
                }
            }`
        }),
    });

    return getUserPublishedRes;
};

const getUserFavoritesFunc = async (userId) => {
    const getUserFavoritesRes = await fetch("https://boop416-server.herokuapp.com/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getUserFavorites(_id:"${userId}") {
                    title
                    cover_image
                }
            }`
        }),
    });

    return getUserFavoritesRes;
}

module.exports = {
    getUserPublishedFunc,
    getUserFavoritesFunc,
}