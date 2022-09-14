import React, { useState, useContext, useRef, useEffect, useMemo, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import CardPlaylist from '../../UI/CardPlaylist/CardPlaylist'; 
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';

import { getSubscribtionsList } from '../../../API/requestListAPI';
import { pageUp } from '../../../utils/pageUp';
import useSetTitle from '../../../hooks/useSetTitle';

const Subscriptions = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [subList, setSubList] = useState({ items: [], nextPageToken: '' });
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const paginationObserver = useRef(); 
    const { layout: { loggedIn }, setLayout } = useContext(LayoutContext);
    
    const fetchHandler = async () => {
        try {
            setIsLoading(true);
            const fetchResponse = await getSubscribtionsList(subList.nextPageToken);
            const nextPageToken = fetchResponse.data.nextPageToken;
            const updatedSubList = [...subList.items, ...fetchResponse.data.items];
            setSubList({ nextPageToken, items: updatedSubList });
            setIsLoading(false);
        } catch(error) {
            const message = error?.response?.data?.error?.message || error;
            console.log(message);
        }
    };

    useEffect(() => {
        pageUp();
        fetchHandler();
    }, [loggedIn]);

    // scroll pagination Intersection observer
    const lastNode = useCallback(lastNode => {
        if (isLoading || !subList.nextPageToken) return
        if (paginationObserver.current) paginationObserver.current.disconnect(); 
        paginationObserver.current = 
            new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) fetchHandler();
            });
        if (lastNode) paginationObserver.current.observe(lastNode);
    }, [isLoading]); 

    useSetTitle('subscriptions', '', [], setLayout);

    const subListJSX = useMemo(() => subList.items.map((channel, index, array) => {
        const listItem = 
            <CardPlaylist 
                object={channel}
                key={channel.id} /> 

        const isLast = (index === array.length - 1); 
        if (isLast) return <div ref={lastNode} key={channel.id}> {listItem} </div>  
        return listItem
    }), [subList]);

    return (
        <div className='screen_horizontal'>
            <h2>Subscriptions:</h2>

            <CSSTransition  
                    in={subList.items.length > 0} 
                    timeout={2100} 
                    classNames="transition" 
                    unmountOnExit 
                    nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} className='transition_pos_abs'>
                    {subListJSX}
                    {isLoading && <LoadingPlaceholder quantity={1}/>}
                </div> 
            </CSSTransition>

            <CSSTransition  
                    in={isLoading} 
                    timeout={2100} 
                    classNames="transition_spinner" 
                    unmountOnExit 
                    appear={true} 
                    nodeRef={transitionNodeRef}>    
                <div ref={transitionNodeRef} className='transition_pos_abs'>
                    <LoadingPlaceholder 
                            quantity={4}
                            placeholderType='CardPlaylist'
                            subType='channel'/>
                </div>
            </CSSTransition>
        </div>
    )
}

export default Subscriptions

