import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import AxiosInterceptorBoundary from '../AxiosInterceptorBoundary/AxiosInterceptorBoundary';

import Header from '../../UI/Header/Header';
import Sidebar from '../../UI/Sidebar/Sidebar';
import SignInModal from '../../UI/SignInModal/SignInModal';

import useFirstVisitInit from '../../../hooks/useFirstVisitInit';

import './_mainBoundary.scss';

const MainBoundary = () => {
    const { layout: { sideBarOpen }, setLayout } = useContext(LayoutContext);

    useFirstVisitInit();

    useEffect(() => { 
        if (document.documentElement.clientWidth < 1100) {
            setLayout(prev =>  ({...prev, sideBarOpen: false}));
        }
        if (!localStorage.getItem('token').length) {
            setLayout(prev =>  ({...prev, loggedIn: false}));
        }
    }, []);

    const sidebarHandler = () => {
        if (document.documentElement.clientWidth < 768) {
            setLayout(prev =>  ({...prev, sideBarOpen: false}));
        }
    };

    return (
        <>
            <Header/>
            <Sidebar/>
            <main
                className={sideBarOpen ? 'main_sidebar_open' : 'main_sidebar_closed'}  
                onClick={sidebarHandler}> 
                <ErrorBoundary>
                    <AxiosInterceptorBoundary> 
                        <SignInModal/>
                        <Outlet/>
                    </AxiosInterceptorBoundary>
                </ErrorBoundary>   
            </main>
        </>
    )
 }

export default MainBoundary

