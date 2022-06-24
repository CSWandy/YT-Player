import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { LayoutProvider } from './contexts/LayoutContext';  

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_YT_OATH_KEY1}>  
            <LayoutProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </LayoutProvider> 
        </GoogleOAuthProvider>
    </React.StrictMode>
)
