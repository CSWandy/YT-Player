import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { LayoutProvider } from './contexts/LayoutContext';  
import { WindowSizeProvider } from './contexts/WindowSizeContext';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_YT_OATH_KEY1}>  
            <WindowSizeProvider>
                <LayoutProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </LayoutProvider> 
            </WindowSizeProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
)
