import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import moment from 'moment';
import numeral from 'numeral';

import ImgFallback from '../ImgFallback/ImgFallback';
import CardVideoDescription from './CardVideoDescription/CardVideoDescription';

import { getChannelDetails, getVideoDetails } from '../../../API/requestListAPI';

import './_video-card.scss';

const CardVideo = (props) => { 
    const [views, setViews] = useState();
    const [duration, setDuration] = useState();
    const [channelIcon, setChannelIcon] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    const {
        video, 
        idSrc, 
        layout, 
        showDescription = true, 
        showChannel = true, 
        showStats = true,
        channel = false,
        playlistId = '',
    } = props;
    
    const {
        id,
        snippet: {
            channelId,
            channelTitle,
            description,
            title,
            publishedAt,
            thumbnails: {
                medium,
                high
            },
        },
    } = video;

    let videoId;

    switch(idSrc) {
        case 'snippet':
            videoId = video.snippet.resourceId.videoId;
            break
        default:
            switch(id.kind) {
                case 'youtube#channel':
                    videoId = id.channelId;
                    break
                case 'youtube#searchResult':
                    videoId = id.videoId;
                    break
                case 'youtube#video' :
                    videoId = id.videoId;
                    break
                default:
                    videoId = id
                    break
            }
    }

    useEffect(() => {
        const async = async () => {
            try {
                setIsLoading(true);
                const videoDetails = await getVideoDetails(videoId);
                const videoStats = videoDetails.data.items[0];
                const durationSec = !!videoStats && moment.duration(videoStats?.contentDetails?.duration).asSeconds();
                const durationFormatted = moment.utc(durationSec * 1000).format('mm:ss');
                setDuration(durationFormatted);
                setViews(videoStats?.statistics?.viewCount);
                if (showChannel) {
                    const channelDetails = await getChannelDetails(channelId);
                    setChannelIcon(channelDetails.data.items[0].snippet.thumbnails.default);
                } 
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, []);
 

    const goToWatch = () => {
        channel ?
        navigate(`/channel/${videoId}`)
        : navigate(`/watch/${videoId}#${playlistId}`);
    };

    const goToChannel = () => {
        navigate(`/channel/${channelId}`);
    };

    return (
        <section className={'video-card_'+layout}>
            <div className={'video-card_'+layout+'_head'}
                 onClick={goToWatch}>
                <ImgFallback
                    src={(layout === 'horizontal') ? medium.url : high.url} 
                    alt="thumbnail" 
                    className={'video-card_'+layout+'_head_image'+(channel ? '_channel' : '')} />
                {!!duration && !channel &&
                <span className={'video-card_'+layout+'_head_duration'}>
                    {duration}
                </span>}
            </div>

            <div className={'video-card_'+layout+'_description'}>
                <h3 className={'video-card_'+layout+'_description_title'}>{parse(title)}</h3>
                {showStats && videoId && (
                    <div className={'video-card_'+layout+'_description_stats'}>
                    {!!views && ( numeral(views).format('0.a') +' Views • ')} {moment(publishedAt).format("MMM Do YYYY")}
                    </div>
                )}
                
                {showChannel && !channel && !isLoading &&
                <div className={'video-card_'+layout+'_channel'} onClick={goToChannel}>
                    <ImgFallback 
                        src={channelIcon?.url} 
                        alt="channel thumb" 
                        className={'video-card_'+layout+'_channel_image'} />
                    <h4 className={'video-card_'+layout+'_channel_title'}>{channelTitle}</h4>
                </div> }

                {showDescription && 
                <CardVideoDescription layout={layout} description={description}/> }
            </div>
        </section>
    )
}

export default CardVideo
