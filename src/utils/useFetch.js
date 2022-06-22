import { useContext, useEffect } from 'react';
import { LayoutContext } from '../contexts/LayoutContext';
import { googleLogout } from '@react-oauth/google';

const useFetch = (doFetch, url, setIsLoading, dependencies, pageUp = false) => {

    const { setLayout } = useContext(LayoutContext);

    return useEffect( () => { 
        async function asyncWrapper() {
            try { 
                if (pageUp) window.scroll({ top: 0, behavior: 'smooth' });
                setIsLoading(true);
                await doFetch(url);
                setIsLoading(false);
            } catch (error) {   
                if (error?.response?.status === 401) {
                    localStorage.setItem('token','');
                    setLayout(prev => ({...prev, loggedIn:false }));
                    googleLogout();
                } else {
                    console.log(error);
                }
            }    
        }

        asyncWrapper();
    }, [...dependencies]);
   
};

export default useFetch 