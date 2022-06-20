import {createContext, useState} from 'react';

const initialState = {
    kind: "youtube#playlistItemListResponse",
    etag: '',
    nextPageToken: '',
    prevPageToken: '',
    pageInfo: {
        totalResults: 0,
        resultsPerPage: 0
    },
    items: [{}]};

export const CurrentPlContext = createContext(initialState);
    
export const CurrentPlProvider = ({ children }) => {
    const [curPl, setCurPl] = useState(initialState);

    const value = { curPl, setCurPl };
    
    return  <CurrentPlContext.Provider value={value}> 
                {children} 
            </CurrentPlContext.Provider>
  };