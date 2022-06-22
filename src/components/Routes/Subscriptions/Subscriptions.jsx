import React, { useState, useEffect, useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ThumbnailPlaylist from '../../UI/ThumbnailPlaylist/ThumbnailPlaylist'; 
import Spinner from '../../UI/Spinner/Spinner';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';

const Subscriptions = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [subList, setSubList] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { layout: {menuActive}, setLayout } = useContext(LayoutContext);

    useEffect(() => {
        setLayout(prev => ({...prev, menuActive:`Subscriptions`})); 
        document.title = `Subscriptions`;
    }, []);
    
    const doFetch = async () => {
        const { data } = 
            await apiRequest.get('/subscriptions', {
                params: {
                    part: 'snippet,contentDetails',
                    mine: true,
                },
                withToken: true,
            });
        setSubList(data.items);
    };

    useFetch(doFetch, null, setIsLoading, [menuActive], true);

    return (
        <div className='screen_horizontal'>
            <h2>Subscriptions:</h2>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2100} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        appear={true} 
                        nodeRef={transitionNodeRef}>    
                <div ref={transitionNodeRef} className='transition_pos_abs'>
                    <Spinner 
                            qty={4}
                            parent={"ThumbnailPlaylist"}
                            type='channel'/>
                </div>
            </CSSTransition>
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2}>
                    {subList.map(channel => 
                        (<ThumbnailPlaylist 
                                        object={channel}
                                        type='channel'
                                        key={channel.id}
                                        requestStats={false}/>))}
                </div> 
            </CSSTransition>
        </div>
    )
}

export default Subscriptions

