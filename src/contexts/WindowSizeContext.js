import {createContext,} from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const initialState = {
    windowWidth: undefined,
    windowHeight: undefined,
};

export const WindowSizeContext = createContext(initialState);

export const WindowSizeProvider = ({ children }) => {

    const size = useWindowSize(); 
    
    return  <WindowSizeContext.Provider value={size}> 
                {children} 
            </WindowSizeContext.Provider>
  };