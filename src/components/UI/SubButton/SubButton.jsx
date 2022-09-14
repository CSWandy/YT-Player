import { memo, useContext } from 'react';

import { LayoutContext } from '../../../contexts/LayoutContext';

import { subscribe, unsubscribe } from '../../../API/requestListAPI';

import './_subButton.scss';

const SubButton = ( { isSubscribed, channelId, setIsSaved, subsriptionId } ) => {
    const { layout: {loggedIn} } = useContext(LayoutContext);
        
    const subscribeHandler = async () => {
        if (isSubscribed) {
            await unsubscribe(subsriptionId)
            .then(response => {
                if (response.status === 204) setIsSaved(prev => !prev); 
            });
       } else { 
            await subscribe(channelId)
            .then(response => {
                if (response.status === 200) setIsSaved(prev => !prev); 
            });
        }
    };

    return (
        loggedIn && 
        <button className='channel_subscribe_button'
                onClick={subscribeHandler} >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe' }
        </button>
    )
}

export default memo(SubButton)
