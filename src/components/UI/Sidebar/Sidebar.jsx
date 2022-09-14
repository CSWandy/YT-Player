import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ThumbnailPlaylistMini from '../ThumbnailPlaylistMini/ThumbnailPlaylistMini';
import { LayoutContext } from '../../../contexts/LayoutContext'; 

import { getPlaylistDetails } from '../../../API/requestListAPI';

import {
    MdSubscriptions,
    MdThumbUp,
    MdHistory,
    MdLibraryBooks 
} from 'react-icons/md';

import './_sidebar.scss';

const Sidebar = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [plData, setPlData] = useState([]);
    const [plFiltered, setPlFiltered] = useState(plData);
    const [filter, setFilter] = useState('');
    const { layout: { sideBarOpen, plDropDownOpen }, setLayout } = useContext(LayoutContext);
    const savedPl = JSON.parse(localStorage.getItem('savedPlaylists')).join();

    useEffect(() => {
        const async = async () => {
            try {
                setIsLoading(true);
                const { data: { items } } = await getPlaylistDetails(savedPl);
                setPlData(items);
                setPlFiltered(items);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, [savedPl]);

    const dropDownHandler = e => {
        e.preventDefault();
        e.target.parentNode.blur();
        setLayout(prev => ({...prev, plDropDownOpen:!plDropDownOpen}));
        setFilter('');
        setPlFiltered(plData);
    };

    const filterHandler = e => {
        (e.target.value === '')?
        setPlFiltered(plData)
        :setPlFiltered(plData.filter(plItem => {
            const title = plItem.snippet.title.toLowerCase();
            const input = e.target.value.toLowerCase();
            return title.indexOf(input) > 0} ));
        setFilter(e.target.value);
    };

    return (
    <nav className={sideBarOpen ? 'sidebar sidebar_open' : 'sidebar'}>
        <Link className='sidebar_item' to='/playlist'>
            <MdLibraryBooks className='sidebar_item_logo' size={23} />
            <span className='sidebar_item_text'>Playlists</span>
            <span className="sidebar_item_dropdown" onClick={dropDownHandler}></span>
        </Link>
        {plDropDownOpen && !isLoading &&
            <div className='sidebar_item_dropdown_list'>
                <input 
                    className='sidebar_item_dropdown_list_filter' 
                    type="text" 
                    placeholder='Filter...' 
                    value={filter} 
                    size={filter.length} 
                    onChange={filterHandler}/>
                {plFiltered.map(pl => 
                    (<ThumbnailPlaylistMini object={pl} key={pl.id}/>))}
            </div> }
        <Link className='sidebar_item' to='/subscriptions'>
            <MdSubscriptions className='sidebar_item_logo' size={23} />
            <span className='sidebar_item_text'>Subscriptions</span>
        </Link>
        <Link className='sidebar_item' to='/liked'>
            <MdThumbUp className='sidebar_item_logo' size={23} />
            <span className='sidebar_item_text'>Liked</span>
        </Link>
        <Link className='sidebar_item' to='/history'>
            <MdHistory className='sidebar_item_logo' size={23} />
            <span className='sidebar_item_text'>History</span>
        </Link>
        <Link id='privacy' to='/privacy'>
            <span className='sidebar_item_text'>Privacy policy</span>
        </Link>
    </nav>
    )
}

export default Sidebar
