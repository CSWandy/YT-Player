import React, { useState, useRef, useLayoutEffect } from 'react';
import parse from 'html-react-parser';

import SubButton from '../SubButton/SubButton';

import { useNavigate } from "react-router-dom";
import calculateLines from '../../../utils/textHeightCalc';

import './_thumbnailPlaylist.scss';

const ThumbnailPlaylist = ({ object, type, activeLink = true, search = false, lines = 6}) => {
    const {
        id,
        snippet: {
            title,
            publishedAt,
            channelId,
            description,
            thumbnails: { default:thumbnailDefault, medium },
        }
    } = object;
    
    let savedPl =  localStorage.getItem('savedPlaylists');
    const [descDivider, setDescDivider] = useState(description.length);
    const [isSaved, setIsSaved] = useState(savedPl.includes(id));
    const textNode = useRef();
    const navigate = useNavigate();

    const thumbnailLinkHandler = () => {
        if (activeLink) {
            switch(type) {
                case 'playlist': 
                    search ?
                    navigate(`/playlist/${id.playlistId}`)
                    :navigate(`/playlist/${id}`);
                    break;
                case 'channel': 
                    const {snippet: 
                        { resourceId: 
                            {channelId:channelId2}
                        }
                    } = object;
                    navigate(`/channel/${channelId2}`);
                    break;
                default:
                    break;
                }
            }
    };

    useLayoutEffect(() => {
        const textWidth = textNode.current?.offsetWidth;
        setDescDivider(calculateLines(description, lines, textWidth, 20)); 
    },[object]);

    const saveHandler = () => {
        savedPl =  localStorage.getItem('savedPlaylists');
        search?
            isSaved ?
                localStorage.setItem('savedPlaylists', savedPl.split(',').filter(pl => (pl !== id.playlistId)).join(','))
                :localStorage.setItem('savedPlaylists', id.playlistId + ',' + savedPl)
            :isSaved ?
                localStorage.setItem('savedPlaylists', savedPl.split(',').filter(pl => (pl !== id)).join(','))
                :localStorage.setItem('savedPlaylists', id + ',' + savedPl);
        setIsSaved(!isSaved);
    };
 
    return (
        <section className={'horizontal_thumbnail'} >
            <div className='horizontal_thumbnail_head'>
        <img className={'horizontal_thumbnail_head_image_'+type+(activeLink? ' horizontal_thumbnail_head_image_link' : '')} 
             src={medium.url} 
             alt={type+title} 
             onClick={thumbnailLinkHandler}/>
             {type === 'playlist' && 
            <button className='horizontal_thumbnail_head_button' onClick={saveHandler}> {isSaved? 'Unsave' : 'Save'} </button>}
            {type === 'channel' && 
            <SubButton channelItem={object} channelId={object.snippet.resourceId.channelId}/>}
        </div>
        <div className='horizontal_thumbnail_description'>
            <h3 className='horizontal_thumbnail_description_title'>{parse(title)}</h3>
            <div className='horizontal_thumbnail_description_text'>
                <span ref={textNode}>{description ? description?.slice(0, descDivider) : "No words, no thoughts..."}</span>
                {(description?.length > descDivider) &&
                <details>
                    <summary></summary>
                    {description?.slice(descDivider)}
                </details>}   
            </div>
        </div>
        </section>
        )
}

export default ThumbnailPlaylist