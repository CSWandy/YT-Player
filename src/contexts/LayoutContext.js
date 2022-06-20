import {createContext, useState} from 'react';

const initialState = {
    menuActive:'',
    sideBarOpen: true,
    plDropDownOpen: false,
    loggedIn: false,
};

export const LayoutContext = createContext(initialState);

    
export const LayoutProvider = ({ children }) => {
    const [layout, setLayout] = useState(initialState);

    const value = { layout, setLayout };
    
    return  <LayoutContext.Provider value={value}> 
                {children} 
            </LayoutContext.Provider>
  };