import { useGoogleLogin } from '@react-oauth/google';
import React, { memo, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from '../../../contexts/LayoutContext';

import './_signInModal.scss';

const SignInModal = () => {
    const {layout: { menuActive, loggedIn }, setLayout} = useContext(LayoutContext);
    const location = useLocation();
    const transitionNodeRef = useRef();
    const pathToShow = ['subscriptions', 'liked'];
    const isLoginSensitive = pathToShow.some(item => location.pathname.includes(item));

    const logInHandler = useGoogleLogin({
        onSuccess: tokenResponse => {
            setLayout(prev => ({...prev, loggedIn: true, menuActive: menuActive + ' '}));
            localStorage.setItem('token', tokenResponse.access_token);
        },
        scope: `https://www.googleapis.com/auth/youtube.force-ssl`,
    });
    
  return (
        !loggedIn && isLoginSensitive &&
        <div ref={transitionNodeRef}  className="login_modal">
            <span>Please, </span> 
            <span className='login_modal_sign-in' onClick={logInHandler}> 
                sign in 
            </span> 
            <span> to unlock this screen</span> 
        </div>   
  )
}

export default memo(SignInModal)