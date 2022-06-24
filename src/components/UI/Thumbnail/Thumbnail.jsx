import React, { useState, useRef, useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import moment from 'moment';
import numeral from 'numeral';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ImgFailProne from '../ImgFailProne/ImgFailProne';

import useHeightCalc from '../../../utils/useHeightCalc';
import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';

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
    const [isLoading, setIsLoading] = useState(true);
    const [descDivider, setDescDivider] = useState(description.length);
    const {layout:{sideBarOpen}} = useContext(LayoutContext);
    const textNode = useRef();
    const navigate = useNavigate();

    const doFetchStats = useCallback( async videoId => {
        if (showStats && videoId) {
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
        }
    }, []);
    
    const doFetchChannelLogo = useCallback( async channelId => {
        if (showChannel) {
            const { data: { items } } = 
            await apiRequest.get('/channels', {
                params: {
                    part: 'snippet',
                    id: channelId,
                }
            });
            
            setChannelIcon(items[0].snippet.thumbnails.default);
        }
    }, []);
    
    useFetch(doFetchStats, [videoId], () => {}, [videoId]);
    useFetch(doFetchChannelLogo, [channelId], setIsLoading, [videoId]);
    useHeightCalc(textNode, setDescDivider, description, type, [sideBarOpen, description]);

    const goToWatch = () => {
        (modifier === "_channel") ?
        navigate(`/channel/${videoId}`)
        : navigate(`/watch/${videoId}#${plId}`);
    };

    const goToChannel = () => {
        navigate(`/channel/${channelId}`);
    };

    return (
        <section className={'thumbnail_'+type}>
            <div className={'thumbnail_'+type+'_head'}
                 onClick={goToWatch}>
                {(type === 'horizontal') ?
                <ImgFailProne
                    src={medium.url} 
                    alt="thumbnail" 
                    className={'thumbnail_'+type+'_head_image'+modifier} />
                :<ImgFailProne 
                    src={high.url} 
                    alt="thumbnail" 
                    className={'thumbnail_'+type+'_head_image'} />}
                <span className={'thumbnail_'+type+'_head_duration'}>
                    {!!duration && !modifier && duration}
                </span>
            </div>

            <div className={'thumbnail_'+type+'_description'}>
                <h3 className={'thumbnail_'+type+'_description_title'}>{parse(title)}</h3>
                {showStats && videoId && (
                    <div className={'thumbnail_'+type+'_description_stats'}>
                    {!!views && ( numeral(views).format('0.a') +' Views • ')} {moment(publishedAt).format("MMM Do YYYY")}
                    </div>
                )}
                
                {showChannel && !modifier && !isLoading &&
                (<div className={'thumbnail_'+type+'_channel'} onClick={goToChannel}>
                    <ImgFailProne 
                        src={channelIcon?.url} 
                        alt="channel thumb" 
                        className={'thumbnail_'+type+'_channel_image'} />
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
