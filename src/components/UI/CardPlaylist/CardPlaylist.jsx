import React, { useState, memo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import CardPlaylistDescription from './CardPlaylistDescription/CardPlaylistDescription';
import SubButton from '../SubButton/SubButton';
import ImgFallback from '../ImgFallback/ImgFallback';

import { checkSubscription } from '../../../API/requestListAPI';

import './_thumbnailPlaylist.scss';

const CardPlaylist = ({ object, activeLink = true, searchScreen = false, lines = 6}) => {
    const {
        id,
        kind,
        snippet: {
            title,
            description,
            thumbnails: { medium },
        }
    } = object;
 
    let savedPlaylists = JSON.parse(localStorage.getItem('savedPlaylists'));
    const contentType = kind.slice(kind.indexOf('#') + 1);
    const isSavedInit = (contentType === 'subscription') || ((contentType === 'playlist') && savedPlaylists.includes(id));
    const [isSaved, setIsSaved] = useState(isSavedInit); 
    const [subsriptionId, setSubsriptionId] = useState(id); 
    const navigate = useNavigate();

    const thumbnailLinkHandler = () => {
        if (!activeLink) return
        if (contentType === 'playlist') {
            searchScreen ?
            navigate(`/playlist/${id.playlistId}`)
            :navigate(`/playlist/${id}`);
        } else {
            const channelId = object.snippet.resourceId.channelId;
            navigate(`/channel/${channelId}`);
        }
    };

    useEffect(() => {
        checkSub();
    }, []);

    const checkSub = async () => {
        try {
            if ( kind !== 'youtube#channel') return
            const { 
                snippet: { resourceId: { channelId: channelId2 }}
            } = object;
            const subList = await checkSubscription(channelId2);
            if (subList.data.items.length > 0) {
                setIsSaved(true);
                setSubsriptionId(subList.data.items[0]);
                console.log('SubsriptionId', subList.data);
            }
        } catch(error) {
            const message = error?.response?.data?.error?.message || error;
            console.log(message);
        }
    };

    const saveHandler = () => {
        savedPlaylists =  JSON.parse(localStorage.getItem('savedPlaylists'));
        let itemId;

        searchScreen?
        itemId = id.playlistId
        :itemId = id;

        isSaved ?
        localStorage.setItem('savedPlaylists', JSON.stringify(savedPlaylists.filter(savedId => (savedId !== itemId))))
        :localStorage.setItem('savedPlaylists', JSON.stringify([itemId, ...savedPlaylists]));
        setIsSaved(!isSaved);
    };
 
    return (
        <section className={'horizontal_thumbnail'} >
            <div className='horizontal_thumbnail_head'>
                <ImgFallback 
                    className={
                        'horizontal_thumbnail_head_image' + 
                        (!searchScreen && isSaved ? '' : ' faded'  ) + 
                        (activeLink ? ' link' : '') 
                    } 
                    src={medium.url} 
                    alt={contentType + title} 
                    onClick={thumbnailLinkHandler}/>
                
                {contentType === 'playlist' && 
                <button 
                    className='horizontal_thumbnail_head_button' 
                    onClick={saveHandler}> 
                    {isSaved? 'Unsave' : 'Save'} 
                </button>}
                
                {(contentType === 'subscription' || contentType === 'channel') && 
                <SubButton 
                    channelId={object.snippet.resourceId.channelId}
                    subsriptionId={subsriptionId}
                    isSubscribed={isSaved}
                    setIsSaved={setIsSaved}/>}
            </div>

            <CardPlaylistDescription 
                                lines={lines}
                                description={description}
                                title={title}/>
        </section>
    )
}

export default memo(CardPlaylist)