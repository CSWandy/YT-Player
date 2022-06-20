import React from 'react';

import SubButton from '../SubButton/SubButton';

import './_channelScreenHeader.scss';

const ChannelScreenHeader = ( { channelItem, channelId } ) => {

    return (
        <div className='channel_screen_header'>
            <img src={channelItem?.snippet?.thumbnails?.medium?.url} 
                alt='channel logo' 
                className='channel_screen_header_logo'/>
            <div className='channel_screen_header_description'>
                <div className='channel_screen_header_description_text'>
                    <h2 className='channel_screen_header_description_text_title'>{channelItem?.snippet?.title}</h2>
                    <span className='channel_screen_header_description_text_stats'>
                        {channelItem?.statistics?.subscriberCount} subscribers
                    </span>
                </div>
                <SubButton channelItem={channelItem} channelId={channelId}/>
            </div>
        </div>
    )
}

export default ChannelScreenHeader
