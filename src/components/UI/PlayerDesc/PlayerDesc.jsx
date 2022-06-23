import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import numeral from 'numeral';

import useHeightCalc from '../../../utils/useHeightCalc';
import useFetch from '../../../utils/useFetch';
import apiRequest from '../../../utils/apiRequest';

import './_playerDesc.scss';
import ImgFailProne from '../ImgFailProne/ImgFailProne';

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
                    part: 'snippet,statistics',
                    id: channelId,
                }
        });

        setChannel(items[0]);
    };

    useFetch(doFetch, channelId, setIsLoading, []);

    useHeightCalc(textNode, setDescDivider, description, 'horizontal', [video], 18);

    const goToChannel = () => {
        navigate(`/channel/${channelId}`);
    };

    const channelSubs = numeral(channel?.statistics?.subscriberCount).format('0.a');
    const channelVids = numeral(channel?.statistics?.videoCount).format('0.a');

    return (
        !isLoading &&
        <div className={'player_desc'}>
            <div className='player_desc_vid'>
                <span className='player_desc_vid_headline'> 
                    <h2 className={'player_desc_vid_headline_title'}> {title} </h2>
                    <span className={'player_desc_vid_headline_likes'}>
                        {numeral(likeCount).format('0.a')} Likes 
                    </span>
                </span>
                <span className={'player_desc_vid_stats'}>
                    {numeral(viewCount).format('0.a')} Views • {moment(publishedAt).format("MMM Do YYYY")}   
                </span>
            </div>
        
            <div className={'player_desc_channel'}>
                <ImgFailProne  
                    className='player_desc_channel_image' 
                    src={channel?.snippet?.thumbnails?.default?.url} 
                    alt="channel thumbnail" 
                    onClick={goToChannel} />
                <span className='player_desc_channel_desc'>
                    <h4 className={'player_desc_channel_desc_title'}> {channelTitle} </h4>
                    <span className={'player_desc_channel_desc_subs'}>
                        {channelSubs} Subs • {channelVids} Vids   
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