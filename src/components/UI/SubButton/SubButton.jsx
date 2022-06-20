import { useEffect, useState, useContext } from 'react';

import { LayoutContext } from '../../../contexts/LayoutContext';

import { googleLogout } from '@react-oauth/google';
import apiRequest from '../../../utils/apiRequest';

import './_subButton.scss';

const SubButton = ( { channelItem, channelId } ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptions, setSubscriptions ] = useState(null);
    const { layout: {loggedIn}, setLayout } = useContext(LayoutContext);
    
    useEffect( () => { 
        const doFetch = async () => {
            try {
                setIsLoading(true);
                const subList = await apiRequest.get('/subscriptions', {
                    params: {
                        part: 'snippet',
                        mine: true,
                    }
                });
                setSubscriptions(subList.data.items);
                setIsLoading(false);
            } catch (error) {
                localStorage.setItem('token','');
                setLayout(prev => ({...prev, loggedIn:false }));
                googleLogout();
            }             
        };

            doFetch(channelId);
        }, [channelId]);

    let subscribed = 
        subscriptions &&
        subscriptions.reduce((acc, item) => {
            if (item.snippet.resourceId.channelId === channelItem?.id ||
                item.snippet.resourceId.channelId === channelItem?.snippet?.resourceId?.channelId) {
                acc = [true, item.id];
            }
            return acc
        }, [false]);
        
    const subscribeHandler = async () => {
        subscribed[0]?
        
        (await apiRequest.delete('/subscriptions', 
            {data: {id: subscribed[1]} })
        .then(response => {if (response.status === 204) { setSubscriptions([]); }}))
        
        : (await apiRequest.post('/subscriptions', 
            {snippet: {resourceId: { "channelId": channelItem.id}}}, 
            { params: { part: 'snippet' }})
        .then(response => {
            if (response.status === 200) {
                 setSubscriptions([...subscriptions, response.data]); 
            }
        }));
    };

    return (
        !isLoading && loggedIn && 
        <button className='channel_subscribe_button'
                onClick={subscribeHandler} >
            {subscribed && subscribed[0]? 'Unsubscribe' : 'Subscribe' }
        </button>
    )
}

export default SubButton
