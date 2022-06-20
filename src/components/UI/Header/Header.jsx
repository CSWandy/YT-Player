import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

import { AiOutlineSearch } from 'react-icons/ai';
import { MdExitToApp } from 'react-icons/md';
import logo from '../../../icons/png/logo3.png';

import { LayoutContext } from '../../../contexts/LayoutContext';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

import './_header.scss';

const Header = () => {

    const [input, setInput] = useState('');
    const {layout: {menuActive, sideBarOpen, loggedIn}, setLayout} = useContext(LayoutContext);
    const transitionNodeRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        (token !== '')?
        setLayout(prev => ({...prev, loggedIn:true}))
        :setLayout(prev => ({...prev, loggedIn:false}));
    },[menuActive]);
    
    const handleSubmit = e => {
        e.preventDefault();
        window.scrollTo(0, 0);
        navigate(`../search/${input}`);
        setInput('');
    };

    const sidebarHandler = () =>
    setLayout(prev =>  ({...prev, sideBarOpen:!sideBarOpen} ));

    const logOutHandler = () => {
        localStorage.setItem('token','');
        googleLogout();
        setLayout(prev => ({...prev, loggedIn:false}));
    };

    const logInHandler = useGoogleLogin({
        onSuccess: tokenResponse => {
            setLayout(prev => ({...prev, loggedIn:true, menuActive:menuActive+' '}));
            localStorage.setItem('token', tokenResponse.access_token);
        },
            scope: "https://www.googleapis.com/auth/youtube.force-ssl",
    });

   return (
        <>
            <header className='header'>
                <div className='header_left'
                     size={26}>
                    <img    className="header_left_logo" 
                            src={logo} 
                            alt="main logo" 
                            onClick={() => sidebarHandler()}/>
                    <span className='header_left_title'>{menuActive}</span>
                </div>

                <form  className='header_center' onSubmit={handleSubmit}>
                    <input  className='header_center_input'
                            type='text'
                            placeholder='Search'
                            value={input}
                            onChange={e => setInput(e.target.value)} />
                    <button className='header_center_submit' type='submit'>
                        <AiOutlineSearch size={22} />
                    </button>
                </form>

                {!loggedIn?         
                (<span className='header_right'>
                    <span className='header_right_text' onClick={logInHandler}>Log In</span>
                    <span className='header_right_logo' onClick={logInHandler}> <MdExitToApp size={30} viewBox={0} width="30px" height="30px"  /> </span>
                </span>)
                :(<span  className='header_right'>
                    <span className='header_right_text' onClick={logOutHandler}>Log Out</span>
                    <span className='header_right_logo' onClick={logOutHandler}> <MdExitToApp size={30} viewBox={0} width="30px" height="30px"  /> </span>
                </span>)}

                {!loggedIn && ( 
                <div className='header_popup'>
                    Please, login
                </div>
                )}
            </header>
            <CSSTransition in={!loggedIn} timeout={4000} appear classNames="login_modal_transition" nodeRef={transitionNodeRef}>   
                    <span ref={transitionNodeRef}  className="login_modal">
                        Please, sign in
                    </span>      
            </CSSTransition>
    </>
   )
}

export default Header

