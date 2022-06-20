import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import moment from 'moment';
import numeral from 'numeral';

import apiRequest from '../../../utils/apiRequest';
import calculateLines from '../../../utils/textHeightCalc';

import './_thumbnail.scss';

const Thumbnail = (props) => {
   
    const {
        video, 
        idSrc, 
        type, 
        showDesc = true, 
        showChannel = true, 
        showStats = true,
        modifier = '',
        plId = '',
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

    const [views, setViews] = useState(null);
    const [duration, setDuration] = useState();
    const [channelIcon, setChannelIcon] = useState();
    const [descDivider, setDescDivider] = useState(description.length);
    const textNode = useRef();
    const navigate = useNavigate();


    useEffect(() => {
        const doFetch = async videoId => {
                const { data: { items } } = 
                    await apiRequest.get('/videos', {
                        params: {
                            part: 'contentDetails, statistics',
                            id: videoId,
                        }
                    });
                const seconds = !!items[0] && moment.duration(items[0]?.contentDetails?.duration).asSeconds();
                const durationFormatted = moment.utc(seconds * 1000).format('mm:ss');
                setDuration(durationFormatted);
                setViews(items[0]?.statistics?.viewCount); 
        };

        if (showStats && videoId) doFetch(videoId);
    }, [videoId]);

    useEffect(() => {
        const doFetch = async channelId => {
            const { data: { items } } = 
            await apiRequest.get('/channels', {
                params: {
                    part: 'snippet',
                    id: channelId,
                }
            });
            setChannelIcon(items[0].snippet.thumbnails.default);
        }

        if (showChannel) doFetch(channelId);
    }, [videoId]);

    const goToWatch = () => {
        (modifier === "_channel") ?
        navigate(`/channel/${videoId}`)
        : navigate(`/watch/${videoId}#${plId}`);
    };

    const goToChannel = () => {
        navigate(`/channel/${channelId}`);
    };

    useLayoutEffect(() => {
        const textWidth = textNode.current?.offsetWidth;
        const widthAmend = document.documentElement.clientWidth > 768 ? 0 : 2;
        (type === 'horizontal') ?
        setDescDivider(calculateLines(description, (6 - widthAmend), textWidth, 16))
        :setDescDivider(calculateLines(description, (3 - widthAmend ), textWidth, 16));
    }, [video, description]);

    return (
        <section className={'thumbnail_'+type}>
            <div className={'thumbnail_'+type+'_head'}
                 onClick={goToWatch}>
                {(type === 'horizontal') ?
                <img src={medium.url} alt="thumbnail" className={'thumbnail_'+type+'_head_image'+modifier}/>
                :<img src={high.url}  alt="thumbnail" className={'thumbnail_'+type+'_head_image'}/>}
                <span className={'thumbnail_'+type+'_head_duration'}>{!!duration && duration}</span>
            </div>

            <div className={'thumbnail_'+type+'_description'}>
                <h3 className={'thumbnail_'+type+'_description_title'}>{parse(title)}</h3>
                {showStats && videoId && (
                    <div className={'thumbnail_'+type+'_description_stats'}>
                    {!!views && ( numeral(views).format('0.a') +' Views • ')} {moment(publishedAt).format("MMM Do YYYY")}
                    </div>
                )}
                
                {showChannel && !modifier && 
                (<div className={'thumbnail_'+type+'_channel'} onClick={goToChannel}>
                    <img src={channelIcon?.url} alt="channel thumb" className={'thumbnail_'+type+'_channel_image'}/>
                    <h4 className={'thumbnail_'+type+'_channel_title'}>{channelTitle}</h4>
                </div> )}

                {showDesc && 
                (<div className={'thumbnail_'+type+'_description_text'}
                      ref={textNode}>
                        {description ? description?.slice(0, descDivider) : "No words, no thoughts..."}
                    {(description?.length > descDivider) &&
                    <details>
                        <summary></summary>
                        {description?.slice(descDivider)}
                    </details>}  
                </div> )}
            </div>
        </section>
    )
}

export default Thumbnail
