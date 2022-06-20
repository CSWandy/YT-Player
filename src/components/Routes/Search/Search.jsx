import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import ThumbnailPlaylist from '../../UI/ThumbnailPlaylist/ThumbnailPlaylist';
import Thumbnail from '../../UI/Thumbnail/Thumbnail';
import Spinner from '../../UI/Spinner/Spinner';
import { LayoutContext } from '../../../contexts/LayoutContext';

import apiRequest from '../../../utils/apiRequest';
import throttle from '../../../utils/throttle';
import { googleLogout } from '@react-oauth/google';

const Search = () => {

    const { query } = useParams();
    const [searchRes, setSearchRes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nextPage, setNextPage] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);
    const [fireFetch, setFireFetch] = useState(false);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { layout: { menuActive }, setLayout } = useContext(LayoutContext);

    useEffect( () =>  { 
        const doFetch = async query => {
            try {
                setIsLoading(true);
                const { data } = 
                    await apiRequest.get('/search', {
                        params: {
                            part: 'snippet',
                            type:'video,channel,playlist',
                            maxResults: 16,
                            q: query, 
                            pageToken: nextPage,
                        }
                    });
                
                setSearchRes([...searchRes, ...data.items]);
                if (data.nextPageToken) {
                    setNextPage(data.nextPageToken);
                } else {
                    setNextPage('');
                    setIsLastPage(true);
                }
                setIsLoading(false);
                setFireFetch(false);
            } catch (error) {
                localStorage.setItem('token','');
                setLayout(prev => ({...prev, loggedIn:false }));
                googleLogout();
            }
        };

        if (fireFetch && !isLastPage) doFetch(query);
    }, [fireFetch]);

    useEffect( () =>  { 
        setLayout(prev => ({...prev, menuActive:`Search - ${query}`}));   
        document.title = `Search - ${query}`;

        const doFetch = async query => {
            try {
                setIsLoading(true);
                const { data } = 
                    await apiRequest.get('/search', {
                        params: {
                            part: 'snippet',
                            type:'video,channel,playlist',
                            maxResults: 16,
                            q: query, 
                        }
                    });
                
                setSearchRes(data.items);
                if (data.nextPageToken) {
                    setNextPage(data.nextPageToken);
                } else {
                    setNextPage('');
                    setIsLastPage(true);
                }
                setIsLoading(false);
                setFireFetch(false);
            } catch (error) {
                localStorage.setItem('token','');
                setLayout(prev => ({...prev, loggedIn:false }));
                googleLogout();
            }
        };

        doFetch(query);
    }, [query, menuActive]);

    useEffect( () =>  { 
        document.addEventListener('scroll',  scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler)
    }, []);

    const scrollHandler = throttle(function(e) {
        console.log('handling');
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 50)) {
                setFireFetch(true);
        }
    }, 2000)

    return (
        <div className='screen_horizontal'>
            <h2>Results for: {query}</h2>
            <CSSTransition  in={isLoading} 
                            timeout={2100} 
                            classNames="transition_spinner" 
                            unmountOnExit 
                            appear={true} 
                            nodeRef={transitionNodeRef}>  
                <div ref={transitionNodeRef} className='transition_lag transition_container'>
                    <Spinner qty={10}
                            parent={"Thumbnail"}
                            type='horizontal'/>
                </div>  
            </CSSTransition>
            <CSSTransition  in={!isLoading} 
                            timeout={2100} 
                            classNames="transition" 
                            unmountOnExit 
                            nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} className='transition_lag transition_container'>
                    {searchRes.map(searchItem => { return (
                        (searchItem.id.kind === 'youtube#playlist')?
                        <ThumbnailPlaylist  object={searchItem}
                                            type='playlist'
                                            key={searchItem.id.playlistId}
                                            lines={8}
                                            search/>
                        :<Thumbnail video={searchItem}
                                    key={searchItem.id.videoId || searchItem.id.channelId}
                                    type="horizontal" 
                                    modifier = {searchItem.id.channelId? ("_channel") : ''}/> )})}
                </div>
            </CSSTransition>
        </div>
    )
}

export default Search
