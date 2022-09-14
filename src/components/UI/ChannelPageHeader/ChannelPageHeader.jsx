import React, { memo } from 'react';

import ImgFallback from '../ImgFallback/ImgFallback';
import SubButton from '../SubButton/SubButton';

import './_channelPageHeader.scss';

const ChannelPageHeader = ( { channelItem, channelId } ) => {

    return (
        <div className='channel_screen_header'>
            <ImgFallback src={channelItem?.snippet?.thumbnails?.medium?.url} 
                alt='channel logo' 
                className='channel_screen_header_logo'/>
            <div className='channel_screen_header_description'>
                <div className='channel_screen_header_description_text'>
                    <h2 className='channel_screen_header_description_text_title'>{channelItem?.snippet?.title}</h2>
                    <span className='channel_screen_header_description_text_stats'>
                        {channelItem?.statistics?.subscriberCount} subscribers
                    </span>
                </div>
                <SubButton channelId={channelId}/>
            </div>
        </div>
    )
}

export default memo(ChannelPageHeader)
