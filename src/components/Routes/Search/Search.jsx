import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import ThumbnailPlaylist from '../../UI/ThumbnailPlaylist/ThumbnailPlaylist';
import Thumbnail from '../../UI/Thumbnail/Thumbnail';
import Spinner from '../../UI/Spinner/Spinner';
import { LayoutContext } from '../../../contexts/LayoutContext';

import useSetTitle from '../../../utils/useSetTitle';
import useFetch from '../../../utils/useFetch';
import apiRequest from '../../../utils/apiRequest';
import throttle from '../../../utils/throttle';

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
        
    const doFetchFirst = useCallback( async query => {
        const { data } = 
            await apiRequest.get('/search', {
                params: {
                    part: 'snippet',
                    type:'video,channel,playlist',
                    maxResults: 16,
                    q: query, 
                }
            });
        
        if (data.nextPageToken) {
            setNextPage(data.nextPageToken);
        } else {
            setNextPage('');
            setIsLastPage(true);
        }

        setSearchRes(data.items);
        setFireFetch(false);
    }, []);
    
    const doFetchPage = useCallback( async (query, nextPage) => {
        if (fireFetch && !isLastPage) {
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
            setFireFetch(false);
        } 
    }, [fireFetch, isLastPage, searchRes]);

    useSetTitle('search', query, [query], setLayout);
    useFetch(doFetchFirst, [query], setIsLoading, [query, menuActive]);
    useFetch(doFetchPage, [query, nextPage], setIsLoading, [fireFetch]);

    useEffect( () =>  { 
        document.addEventListener('scroll',  scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler)
    }, []);

    const scrollHandler = useCallback( throttle(function(e) {
        console.log('handling');
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 50)) {
                setFireFetch(true);
        }
    }, 2000), []);

    return (
        <div className='screen_horizontal'>
            <h2>Results for: {query}</h2>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2100} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        appear={true} 
                        nodeRef={transitionNodeRef}>  
                <div ref={transitionNodeRef} className='transition_pos_abs'>
                    <Spinner 
                            qty={10}
                            parent={"Thumbnail"}
                            type='horizontal'/>
                </div>  
            </CSSTransition>
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} >
                    {searchRes.map(searchItem => { return (
                        (searchItem.id.kind === 'youtube#playlist')?
                        <ThumbnailPlaylist  
                                        object={searchItem}
                                        type='playlist'
                                        key={searchItem.id.playlistId}
                                        lines={8}
                                        searchScreen/>
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
