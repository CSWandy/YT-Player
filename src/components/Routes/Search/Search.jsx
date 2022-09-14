import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import CardPlaylist from '../../UI/CardPlaylist/CardPlaylist';
import CardVideo from '../../UI/CardVideo/CardVideo';
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';
import { LayoutContext } from '../../../contexts/LayoutContext';

import { getSearchResults } from '../../../API/requestListAPI';
import { pageUp } from '../../../utils/pageUp';
import useSetTitle from '../../../hooks/useSetTitle';

const Search = () => { 
    const { query } = useParams();
    const [searchResult, setSearchResult] = useState({ items: [], nextPageToken: '' });
    const [isLoading, setIsLoading] = useState(true); 
    const lastQuery = useRef(query); 
    const paginationObserver = useRef(); 
    const { setLayout } = useContext(LayoutContext);
    
    const searchHandler = async () => {
        try {
            setIsLoading(true);
            const searchResponse = await getSearchResults(query, searchResult.nextPageToken); 
            if (lastQuery.current === query) {
                const nextPageToken = searchResponse.data.nextPageToken;
                const itemsMerge = [...searchResult.items, ...searchResponse.data.items];
                // for some reason API returns duplicate items sometimes - so filtering duplicants
                const idMap = itemsMerge.map(item => item.id.playlistId || item.id.videoId || item.id.channelId);
                const items = itemsMerge.filter((item, index) => {
                    const id = item.id.playlistId || item.id.videoId || item.id.channelId;
                    return !idMap.includes(id, index + 1);
                });
                setSearchResult({ items, nextPageToken });
            } else {
                lastQuery.current = query;
                setSearchResult(searchResponse.data);
            }
            setIsLoading(false);
        } catch(error) {
            const message = error?.response?.data?.error?.message || error;
            console.log(message);
        }
    };

    useEffect(() => {
        pageUp();
        searchHandler();
    }, [query]);

    // scroll pagination Intersection observer
    const lastNode = useCallback(lastNode => {
        if (isLoading || !searchResult.nextPageToken) return
        if (paginationObserver.current) paginationObserver.current.disconnect(); 
        paginationObserver.current = 
            new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) searchHandler();
            });
        if (lastNode) paginationObserver.current.observe(lastNode);
    }, [isLoading]); 
    
    useSetTitle('search', query, [query], setLayout);

    const resultsListJSX = useMemo(() => {  
        return ( 
            searchResult.items.map((searchItem, index, array) => { 
                let card;
                let key;
                if (searchItem.id.kind === 'youtube#playlist') {
                    key = searchItem.id.playlistId;
                    card = 
                        <CardPlaylist  
                            object={searchItem}
                            key={key}
                            lines={8}
                            searchScreen/>
                } else {
                    key = searchItem.id.videoId || searchItem.id.channelId;
                    card = 
                        <CardVideo 
                            video={searchItem}
                            key={key}
                            layout="horizontal" 
                            channel = {!!searchItem.id.channelId}/> 
                }
                const isLast = (index === array.length - 1); 
                if (isLast) return <div ref={lastNode} key={key}> {card} </div>  
                return card
            })
        )
    }, [searchResult]);  

    return (
        <div className='screen_horizontal'>
            <h2>Results for: {query}</h2>
            {resultsListJSX}
            {isLoading &&
            <LoadingPlaceholder quantity={4} placeholderType='CardVideo' subType='horizontal'/> }
        </div>
    )
}

export default Search
