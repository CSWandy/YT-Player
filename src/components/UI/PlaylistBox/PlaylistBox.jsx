import React, { useEffect, useState } from 'react';

import ThumbnailBox from '../ThumbnailBox/ThumbnailBox';

import apiRequest from '../../../utils/apiRequest';

import './_playlistBox.scss';

const PlaylistBox = ( { plId, vidId }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [curPl, setCurPl] = useState({});

    useEffect(() => {
        setIsLoading(true);  
         
        const fetchPl = async plId => {
            const { data: { items } } = 
                await apiRequest.get('/playlistItems', 
                    { params: {
                        part: 'snippet, contentDetails',
                        maxResults: 20,
                        playlistId: plId,
                        }
            });
             
            setCurPl(items);
            setIsLoading(false); 
        };

        const fetchRel = async vidId => {
            const { data: { items } } = 
                await apiRequest.get('/search', 
                    { params: {
                        part: 'snippet',
                        maxResults: 20,
                        relatedToVideoId: vidId,
                        type: 'video,'
                        }
            });

            setCurPl(items);
            setIsLoading(false); 
        };

        (plId !== '') ?
        fetchPl(plId)
        :fetchRel(vidId);
    }, [plId]);

  return (
    !isLoading && 
    <div className='playlist_box'>
        <div className='playlist_box_scrollOffset'>
            {curPl?.map(video => {
                if (video.snippet) {
                    return (
                        <ThumbnailBox  
                                    video={video}
                                    key={(plId !== '') ? video.snippet.resourceId.videoId : video.id.videoId}
                                    idSrc={(plId !== '') ? 'snippet' : ''} 
                                    plId={plId}/>)
                }
            })}
        </div>
    </div>
  )
}

export default PlaylistBox