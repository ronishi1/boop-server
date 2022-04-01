const createContentFunc = async (contentInput, refreshToken, accessToken) => {
    const createContentRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                createContent(contentInput: {
                series_title: "${contentInput.series_title}",
                synopsis: "${contentInput.synopsis}",
                genres: [${contentInput.genres}],
                cover_image: "${contentInput.cover_image}",
                content_type: "${contentInput.content_type}"
                })
            }`
          }),
    });

    return createContentRes;
}

const editContentFunc = async (contentId, editedContentInput, refreshToken, accessToken) => {
    const editContentRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
              query: `mutation {
                editContent(contentID: "${contentId}", contentInput:{
                    synopsis: "${editedContentInput.synopsis}",
                    series_title: "${editedContentInput.series_title}",
                    genres: ["${editedContentInput.genres}"],
                    cover_image: "${editedContentInput.cover_image}"
                  })
              }`
          }),
    });

    return editContentRes;
}

const deleteContentFunc = async (contentId, refreshToken, accessToken) => {
    const deleteContentRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                deleteContent(contentID: "${contentId}")
            }`
          }),
    });

    return deleteContentRes;
};

const publishContentFunc = async (contentId, refreshToken, accessToken) => {
    const publishContentRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                publishContent(contentID: "${contentId}")
            }`
        }),
    });

    return publishContentRes;
};

const rateContentFunc = async (contentId, rating, refreshToken, accessToken) => {
    const rateContentRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                rateContent(contentID: "${contentId}", rating: ${rating})
            }`
        }),
    });

    return rateContentRes;
}

const addToReadListFunc = async (contentId, refreshToken, accessToken) => {
    const readListRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                addContentToReadList(contentID: "${contentId}")
            }`
        }),
    });

    return readListRes;
};

const addToFavoritesFunc = async (contentId, refreshToken, accessToken) => {
    const readListRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                addContentToReadList(contentID: "${contentId}")
            }`
        }),
    });

    return readListRes;
};

const removeFromReadListFunc = async (contentId, refreshToken, accessToken) => {
    const readListRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                removeContentFromReadList(contentID: "${contentId}")
            }`
        }),
    });

    return readListRes;
}

const removeFromFavoritesFunc = async (contentId, refreshToken, accessToken) => {
    const favoritesRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                removeContentFromFavorites(contentID: "${contentId}")
            }`
        }),
    });

    return favoritesRes;
}

const createChapterFunc = async (contentId, chapterTitle, refreshToken, accessToken) => {
    const createChapterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                createChapter(contentID: "${contentId}", chapter_title: "${chapterTitle}")
            }`
        }),
    });

    return createChapterRes;
}

module.exports = {
    createContentFunc,
    editContentFunc,
    deleteContentFunc,
    publishContentFunc,
    rateContentFunc,
    addToReadListFunc,
    addToFavoritesFunc,
    removeFromReadListFunc,
    removeFromFavoritesFunc,
    createChapterFunc,
}