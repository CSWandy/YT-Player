import axiosAPI from "./axiosAPI"; 

export const getSearchResults = (query, pageToken = '') => 
    axiosAPI.get('/search', { 
        params: {
            part: 'snippet',
            type:'video,channel,playlist',
            maxResults: 16,
            q: query,
            pageToken,
        }
    });

export const getRelatedVideos = videoId => 
    axiosAPI.get('/search', { 
        params: {
            part: 'snippet',
            maxResults: 20,
            type: 'video',
            relatedToVideoId: videoId,
        }
    });

export const getSubscribtionsList = pageToken => 
    axiosAPI.get('/subscriptions', { 
        params: {
            part: 'snippet,contentDetails',
            mine: true,
            maxResults: 10,
            pageToken
        },
        withToken: true,
    });

export const checkSubscription = (...channelId) => 
    axiosAPI.get('/subscriptions', { 
        params: {
            part: 'snippet,contentDetails',
            mine: true,
            forChannelId: channelId.split()
        },
        withToken: true,
    });

export const getChannelDetails = channelId => 
    axiosAPI.get('/channels', { 
        params: {
            part: 'snippet,contentDetails,statistics',
            id: channelId
        },
        withToken: true
    });

export const getMyChannelDetails = () => 
    axiosAPI.get('/channels', { 
        params: {
            part: 'snippet',
            mine: true,
        },
        withToken: true
    });

export const getPlaylistDetails = playlistId => 
    axiosAPI.get('/playlists', {
        params: {
            part: 'contentDetails,snippet',
            id: playlistId
        }
    });

export const getPlaylistItems = playlistId => 
    axiosAPI.get('playlistItems', { 
        params: {
                part: 'snippet, contentDetails',
                maxResults: 30,
                playlistId: playlistId,
        }
    });

export const getVideoDetails = videoId => 
    axiosAPI.get('/videos', {
        params: {
            part: 'contentDetails,statistics,snippet',
            id: videoId
        }
    });

export const getLikedVideoDetails = () => 
    axiosAPI.get('/videos', {
        params: {
            part: 'contentDetails,statistics,snippet',
            maxResults: 15, 
            myRating: 'like'
        },
        withToken: true 
    });

export const getCommentsList = (videoId, pageToken = '') => 
    axiosAPI.get('/commentThreads', { 
        params: {
            part: 'snippet',
            videoId,
            pageToken,
        }
    });

export const postComment = payload => 
    axiosAPI.post('/commentThreads', 
    payload,
    { 
        params: { part: 'snippet' },
        withToken: true 
    });

    
export const subscribe = channelId => 
    axiosAPI.post('/subscriptions', 
        {snippet: {resourceId: { "channelId": channelId}}}, 
        { params: { part: 'snippet' },
        withToken: true 
    });  

export const unsubscribe = channelId => 
    axiosAPI.delete('/subscriptions', 
        {data: {id: channelId},
        withToken: true 
    });