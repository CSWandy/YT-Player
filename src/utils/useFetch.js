import { useContext, useEffect } from 'react';
import { LayoutContext } from '../contexts/LayoutContext';
import { googleLogout } from '@react-oauth/google';

import useAsyncError from './useAsyncError';

const useFetch = (doFetch, params, setIsLoading, dependencies, pageUp = false, noThrow = false) => {

    const { setLayout } = useContext(LayoutContext);
    const throwError = useAsyncError();

    return useEffect( () => { 
        async function asyncWrapper() {
            try { 
                if (pageUp) window.scroll({ top: 0, behavior: 'smooth' });
                setIsLoading(true);
                await doFetch(...params);
                setIsLoading(false);
            } catch (error) {   
                const message = error?.response?.data?.error?.message;
                if (noThrow) {
                    console.log(error);
                } else if (error?.response?.status === 401) {
                    localStorage.setItem('token','');
                    setLayout(prev => ({...prev, loggedIn:false }));
                    googleLogout();
                } else if (message?.includes('you have exceeded your') ||
                    message === 'Request had insufficient authentication scopes.' ||
                    error?.response?.status === 404) {
                    throwError(error);
                } else {
                    console.log(error);
                }
            }    
        }
        
        asyncWrapper();
    }, [...dependencies]);
    
};

export default useFetch 