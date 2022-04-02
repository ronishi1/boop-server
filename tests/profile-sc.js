const getUserPublishedFunc = async (userId) => {
    const getUserPublishedRes = await fetch("http://localhost:4000/graphql", {
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
    const getUserFavoritesRes = await fetch("http://localhost:4000/graphql", {
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