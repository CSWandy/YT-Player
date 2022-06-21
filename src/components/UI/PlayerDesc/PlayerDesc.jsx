import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import calculateLines from '../../../utils/textHeightCalc';
import useFetch from '../../../utils/useFetch';
import apiRequest from '../../../utils/apiRequest';

import './_playerDesc.scss';

const PlayerDesc = ( { video } ) => {

    const {
        snippet: {
            channelId,
            channelTitle,
            description,
            title,
            publishedAt
        },
        statistics: {
            viewCount,
            likeCount
        }
    } = video;

    const [channel, setChannel] = useState();
    const [descDivider, setDescDivider] = useState(description.length);
    const [isLoading, setIsLoading] = useState(true);
    const textNode = useRef();
    const navigate = useNavigate();

    const doFetch = async channelId => {
        const { data: { items } } = 
            await apiRequest.get('/channels', {
                params: {
                    part: 'snippet',
                    id: channelId,
                }
        });

        setChannel(items[0]);
    };

    useFetch(doFetch, channelId, setIsLoading, []);

    useLayoutEffect(() => {
        const textWidth = textNode.current?.offsetWidth;
        setDescDivider(calculateLines(description, 5, textWidth, 12));
      }, [video]);

      const goToChannel = () => {
        navigate(`/channel/${channelId}`);
      };

  return (
    !isLoading &&
    <div className={'player_desc'}>
        <div className='player_desc_vid'>
            <span className='player_desc_vid_headline'> 
                <h2 className={'player_desc_vid_headline_title'}> {title} </h2>
                <span className={'player_desc_vid_headline_likes'}>
                    {likeCount} Likes 
                </span>
            </span>
            <span className={'player_desc_vid_stats'}>
                {viewCount} Views • {publishedAt}   
            </span>
        </div>
      
        <div className={'player_desc_channel'}>
            <img 
                className='player_desc_channel_image' 
                src={channel?.snippet?.thumbnails?.default?.url} 
                alt="channel thumbnail" 
                onClick={goToChannel}/>
            <span className='player_desc_channel_desc'>
                <h4 className={'player_desc_channel_desc_title'}> {channelTitle} </h4>
                <span className={'player_desc_channel_desc_subs'}>
                    {channel?.statistics?.subscriberCount} Subs • {channel?.statistics?.videoCount} Vids   
                </span>
            </span>
        </div> 

        <div className={'player_desc_description'} ref={textNode}>
            {description?.slice(0, descDivider)}
            {(description?.length > descDivider) &&
            <details>
                <summary></summary>
                {description?.slice(descDivider)}
            </details>}  
        </div> 
    </div>
  )
}

export default PlayerDesc