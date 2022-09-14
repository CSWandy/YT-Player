import React, { memo, useEffect, useState } from 'react';

import CardPlayerBox from '../CardPlayerBox/CardPlayerBox';

import { getPlaylistItems, getRelatedVideos } from '../../../API/requestListAPI';

import './_playlistBox.scss';

const PlaylistBox = ( { playlistId, videoId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPlaylst, setCurrentPlaylst] = useState({});

    useEffect(() => {
        const async = async () => {
            try {
                setIsLoading(true);
                let relatedVideos = [];
                (playlistId !== '') ?
                relatedVideos = await getPlaylistItems(playlistId)
                :relatedVideos = await getRelatedVideos(videoId);
                setCurrentPlaylst(relatedVideos.data.items);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, []);

  return (
    !isLoading && 
    <div className='playlist_box'>
        <div className='playlist_box_scrollOffset'>
            {currentPlaylst?.map(video => {
                if (video.snippet) return (
                    <CardPlayerBox  
                        video={video}
                        key={(playlistId !== '') ? video.snippet.resourceId.videoId : video.id.videoId}
                        idSrc={(playlistId !== '') ? 'snippet' : ''} 
                        playlistId={playlistId}/>)
            })}
        </div>
    </div>
  )
}

export default memo(PlaylistBox)