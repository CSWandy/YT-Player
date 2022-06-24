import { useState, useContext, useEffect, useCallback } from 'react';

import { LayoutContext } from '../../../contexts/LayoutContext';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';

import './_subButton.scss';

const SubButton = ( { channelItem, channelId, setSubscribedParent = () => {} } ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptions, setSubscriptions ] = useState(null);
    const [subscribed, setSubscribed ] = useState([false]);
    const { layout: {loggedIn} } = useContext(LayoutContext);
    
    const doFetch = useCallback( async () => {
        const subList = await apiRequest.get('/subscriptions', {
            params: {
                part: 'snippet',
                mine: true,
            },
            withToken: true,
        });
        setSubscriptions(subList.data.items);
    }, []);

    useFetch(doFetch, [], setIsLoading, [channelId]);

    useEffect(() => {
        if (subscriptions) {
            const channelIds = subscriptions.map(item => [item.snippet.resourceId.channelId, item.id]);
            setSubscribed(
                channelIds.reduce((acc, Ids) => {
                    if (Ids[0] === channelId) {
                        acc = [true, Ids[1]];
                    }
                    return acc
                }, [false])
            );
        }
    }, [subscriptions, channelId]);
        
    useEffect(() => {
        setSubscribedParent(subscribed[0]);
    }, [subscribed]);

    const subscribeHandler = async () => {
        subscribed[0]?
        (await apiRequest.delete('/subscriptions', 
            {data: {id: subscribed[1]},
            withToken: true })
        .then(response => {if (response.status === 204) { setSubscriptions([]); }}))
        : (await apiRequest.post('/subscriptions', 
            {snippet: {resourceId: { "channelId": channelId}}}, 
            { params: { part: 'snippet' },
            withToken: true })
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
