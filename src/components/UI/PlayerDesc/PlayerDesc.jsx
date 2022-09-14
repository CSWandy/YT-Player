import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import numeral from 'numeral';

import { WindowSizeContext } from '../../../contexts/WindowSizeContext';
import ImgFallback from '../ImgFallback/ImgFallback';

import useHeightCalc from '../../../hooks/useHeightCalc';
import { getChannelDetails } from '../../../API/requestListAPI';

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
    const { windowWidth } = useContext(WindowSizeContext);

    useEffect(() => {
        const async = async () => {
            try {
                setIsLoading(true);
                const channelDetails = await getChannelDetails(channelId);
                setChannel(channelDetails.data.items[0]);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, []);

    useHeightCalc({
        textNode, 
        setDescDivider, 
        description, 
        type: 'horizontal', 
        dependencies: [video, windowWidth], 
        fontSize: 18
    });

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
                <ImgFallback  
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

export default memo(PlayerDesc)