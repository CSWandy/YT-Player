import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import numeral from 'numeral';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';

import './_thumbnailBox.scss';

const Thumbnail = (props) => {
    const {
        video, 
        idSrc, 
        modifier = '',
        plId = '',
    } = props;
    
    const {
        id,
        snippet: { 
            title,
            publishedAt,
            thumbnails: {
                medium,
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
                case 'youtube#video' :
                    videoId = id.videoId;
                    break
                default:
                    videoId = id
                    break
            }
    }

    const [views, setViews] = useState(null);
    const [duration, setDuration] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const doFetch = async videoId => {
        const { data: { items } } = 
            await apiRequest.get('/videos', {
                params: {
                    part: 'contentDetails, statistics',
                    id: videoId,
                }
            });
        const seconds = moment.duration(items[0]?.contentDetails?.duration).asSeconds();
        const durationFormatted = moment.utc(seconds * 1000).format('mm:ss');
        setDuration(durationFormatted);
        setViews(items[0].statistics.viewCount);
    };
 
    useFetch(doFetch, videoId, setIsLoading, [video, videoId]);

    const goToWatch = () => {
        (modifier === "_channel") ?
        navigate(`/channel/${videoId}`)
        : navigate(`/watch/${videoId}#${plId}`);
    };

    return (
        !isLoading &&
        <section className={'thumbnail_box'}>
            <div className={'thumbnail_box_head'} onClick={goToWatch}>
                <img src={medium.url} alt="thumbnail" className={'thumbnail_box_head_image'}/>
                <span className={'thumbnail_box_head_duration'}> {duration} </span>
            </div>

            <div className={'thumbnail_box_description'}>
                <h3 className={'thumbnail_box_description_title'}>{(title.length > 50)? title.slice(0, 50) + '...' : title}</h3>
                    <div className={'thumbnail_box_description_stats'}>
                        {!!views && ( numeral(views).format('0.a') +' Views • ')} {moment(publishedAt).format("MMM Do YYYY")}
                    </div>
            </div>
        </section>
    )
}

export default Thumbnail
