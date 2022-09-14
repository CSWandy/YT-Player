import { googleLogout } from '@react-oauth/google';
import React, { useContext, useEffect } from 'react';

import { LayoutContext } from '../../../contexts/LayoutContext';
import useBoundaryThrowError from '../../../hooks/useBoundaryThrowError';

import axiosAPI from '../../../API/axiosAPI';

const AxiosInterceptorBoundary = ({ children }) => {
    const { setLayout } = useContext(LayoutContext);
    const throwErrorToBoundary = useBoundaryThrowError();

    const logOutHandler = () => {
        localStorage.setItem('token','');
        googleLogout();
        setLayout(prev => ({...prev, loggedIn:false}));
    };

    useEffect(() => {
        const errorInterceptor = error => {
            const message = error?.response?.data?.error?.message;
            const status = error?.response?.status;
            if (status === 401) {
                logOutHandler();
            } else if (message?.includes('you have exceeded your')) {
                throwErrorToBoundary(error);
            }
            return Promise.reject(error);
        };

        const interceptor = axiosAPI.interceptors.response.use(response => response, errorInterceptor);
        
        return () => axiosAPI.interceptors.response.eject(interceptor);
    }, []);

  return (
    <>
        {children}
    </>
  )
}

export default AxiosInterceptorBoundary