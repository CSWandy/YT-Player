import React, { useState, useEffect, useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { googleLogout } from '@react-oauth/google';

import { LayoutContext } from '../../../contexts/LayoutContext';
import apiRequest from '../../../utils/apiRequest';

import Spinner from '../../UI/Spinner/Spinner';
import ThumbnailPlaylist from '../../UI/ThumbnailPlaylist/ThumbnailPlaylist'; 

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
    
    useEffect(() => {
        setIsLoading(true);

        const doFetch = async () => {
            try {
                const { data } = 
                    await apiRequest.get('/subscriptions', {
                        params: {
                            part: 'snippet,contentDetails',
                            mine: true,
                        }
                        });
                setSubList(data.items);
                setIsLoading(false);
            } catch (error) {
                localStorage.setItem('token','');
                setLayout(prev => ({...prev, loggedIn:false }));
                googleLogout();
            }          
        };

        doFetch();
    }, [menuActive]);

    return (
        <div className='screen_horizontal'>
            <h2>Subscriptions:</h2>
            <CSSTransition  in={isLoading} 
                            timeout={2100} 
                            classNames="transition_spinner" 
                            unmountOnExit 
                            appear={true} 
                            nodeRef={transitionNodeRef}>    
                <div ref={transitionNodeRef}>
                    <Spinner qty={4}
                             parent={"ThumbnailPlaylist"}
                             type='channel'/>
                </div>
            </CSSTransition>
            <CSSTransition  in={!isLoading} 
                            timeout={2100} 
                            classNames="transition" 
                            unmountOnExit 
                            nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2}>
                    {subList.map(channel => 
                        (<ThumbnailPlaylist object={channel}
                                            type='channel'
                                            key={channel.id}
                                            requestStats={false}/>))}
                </div> 
            </CSSTransition>
        </div>
    )
}

export default Subscriptions

