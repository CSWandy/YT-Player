import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import Header from '../../UI/Header/Header';
import Sidebar from '../../UI/Sidebar/Sidebar';

import './_layout.scss';

const Layout = () => {
    const {layout:{sideBarOpen}, setLayout} = useContext(LayoutContext);

    useEffect(() => {
        if (localStorage.getItem('firstUse') !== 'false') {
            localStorage.setItem('history', 'dQw4w9WgXcQ');
            localStorage.setItem('savedPlaylists', 'PLTMN6OMDTnKmPEshAkltDlfJYLft6taZO,PLUcXHQ7VorrUQ4VcKSRo598i_8AhQplL_,PLU_aM5EzmeKRZkbmPi7d4-Nz55GxwAHIJ');
            localStorage.setItem('firstUse', 'false');
            localStorage.setItem('token', '');
            window.location.reload();
        }
        if (document.documentElement.clientWidth < 1100) {
            setLayout(prev =>  ({...prev, sideBarOpen:false}));
        }
    },[]);

    const sidebarHandler = () => {
        if (document.documentElement.clientWidth < 768) {
            setLayout(prev =>  ({...prev, sideBarOpen:false}));
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
                    <Outlet/>
                </ErrorBoundary>   
            </main>
        </>
    )
 }

export default Layout

