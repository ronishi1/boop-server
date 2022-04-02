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
                genres: ${JSON.stringify(contentInput.genres)},
                cover_image: "${contentInput.cover_image}",
                content_type: "${contentInput.content_type}"
                })
            }`
          }),
    });

    return createContentRes;
};

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
                    genres: ${JSON.stringify(editedContentInput.genres)},,
                    cover_image: "${editedContentInput.cover_image}"
                  })
              }`
          }),
    });

    return editContentRes;
};

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
};

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
                addContentToFavorites(contentID: "${contentId}")
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
};

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
};

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
};

const editChapterFunc = async (chapterId, chapterInput, refreshToken, accessToken) => {
    const editChapterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                editChapter(chapterID: "${chapterId}", chapterInput: {
                    chapter_title: "${chapterInput.chapter_title}",
                    num_pages: ${chapterInput.num_pages},
                    chapter_content: ${JSON.stringify(chapterInput.chapter_content)},
                    publication_date: "${chapterInput.publication_date}"
                })
            }`
        }),
    });

    return editChapterRes;
};

const deleteChapterFunc = async (chapterId, refreshToken, accessToken) => {
    const deleteChapterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                deleteChapter(chapterID: "${chapterId}")
            }`
        }),
    });

    return deleteChapterRes;
};

const publishChapterFunc = async (chapterId, refreshToken, accessToken) => {
    const publishChapterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                publishChapter(chapterID:"${chapterId}")
            }`
        }),
    });

    return publishChapterRes;
};

const createCharacterFunc = async (storyboardId, characterInput, refreshToken, accessToken) => {
    const createCharacterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                createCharacter(storyboardID: "${storyboardId}", characterInput: {
                    character_name: "${characterInput.character_name}"
                    notes: "${characterInput.notes}"
                    character_image: "${characterInput.character_image}"
                })
            }`
        }),
    });

    return createCharacterRes;
};

const editCharacterFunc = async (storyboardId, characterId, characterInput, refreshToken, accessToken) => {
    const editCharacterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                editCharacter(storyboardID: "${storyboardId}", characterID: "${characterId}", characterInput: {
                    character_name: "${characterInput.character_name}"
                    notes: "${characterInput.notes}"
                    character_image: "${characterInput.character_image}"
                })
            }`
        }),
    });

    return editCharacterRes;
};

const deleteCharacterFunc = async (storyboardId, characterId, refreshToken, accessToken) => {
    const deleteCharacterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                deleteCharacter(storyboardID: "${storyboardId}", characterID: "${characterId}")
            }`
        }),
    });

    return deleteCharacterRes;
};

const createPlotPointFunc = async (storyboardId, plotpointInput, refreshToken, accessToken) => {
    const createPlotPointRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                createPlotPoint(storyboardID: "${storyboardId}", plotpointInput: {
                    plot_point_name: "${plotpointInput.plot_point_name}"
                    notes: "${plotpointInput.notes}"
                    plot_point_image: "${plotpointInput.plot_point_image}"
                })
            }`
        }),
    });

    return createPlotPointRes;
};

const editPlotPointFunc = async (storyboardId, plotpointId, plotpointInput, refreshToken, accessToken ) => {
    const editPlotPointRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                editPlotPoint(storyboardID: "${storyboardId}", plotpointID: "${plotpointId}", plotpointInput: {
                    plot_point_name: "${plotpointInput.plot_point_name}"
                    notes: "${plotpointInput.notes}"
                    plot_point_image: "${plotpointInput.plot_point_image}"
                })
            }`
        }),
    });

    return editPlotPointRes;
};

const deletePlotPointFunc = async (storyboardId, plotpointId, refreshToken, accessToken) => {
    const deletePlotPointRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'cookie': [
                `${refreshToken}` + "; " + `${accessToken}`
            ]
        },
        body: JSON.stringify({
            query: `mutation {
                deletePlotPoint(storyboardID: "${storyboardId}", plotpointID: "${plotpointId}")
            }`
        }),
    });

    return deletePlotPointRes;
};

const getContentInfoFunc = async (contentId) => {
    const getContentInfoRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getContentInfo(contentID: "${contentId}") {
                    _id
                }
            }`
        }),
    });

    return getContentInfoRes;
};

const getContentChapterFunc = async (chapterId) => {
    const getContentChapterRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getContentChapter(chapterID: "${chapterId}") {
                    _id
                }
            }`
        }),
    });

    return getContentChapterRes;
};

const getChaptersFunc = async (chapterIds) => {
    const getChaptersRes = await fetch("http://localhost:4000/graphql", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            query: `query {
                getChapters(chapterIDs: ${JSON.stringify(chapterIds)} ) {
                    _id
                    chapter_title
                    publication_date
                }
            }`
        }),
    });

    return getChaptersRes;
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
    editChapterFunc,
    deleteChapterFunc,
    publishChapterFunc, 
    createCharacterFunc,
    editCharacterFunc,
    deleteCharacterFunc,
    createPlotPointFunc,
    editPlotPointFunc,
    deletePlotPointFunc,
    getContentInfoFunc,
    getContentChapterFunc,
    getChaptersFunc,
}