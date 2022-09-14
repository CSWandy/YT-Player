import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import errorImage from '../../../assets/images/webp/error.webp';

import './_errorBoundary.scss';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: '', 
            type: ''};
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error};
    }

    componentDidCatch(error) {
        const message = error?.response?.data?.error?.message;
        if (message === 'Request had insufficient authentication scopes.') {
            this.setState({ type: 'scope' });
        } else if (message?.includes('you have exceeded your')) {
            this.setState({ type: 'quota' });
        }
    }

    resetHandler() {
        this.setState({ hasError: false });
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                registration.unregister();
            });
        });
        caches.keys().then((keyList) => {
            return Promise.all(
              keyList.map((key) => {
                return caches.delete(key);
              })
            );
          });
    }

    render() { 
        if (this.state.hasError) { 
            return (
                <div className='error_boundary'>
                    { (this.state.type === 'scope') && 
                    <p className='error_boundary_message'>
                        Please, login with all permissions checked
                    </p> }

                    { (this.state.type === 'quota') && 
                    <p className='error_boundary_message'>
                        Sorry, daily limit of Youtube API is exceeded 
                    </p> }

                    <h3 className='error_boundary_code'>
                        {this.state?.error?.response?.status && 
                        (this.state?.error?.response?.status + ' Error')}
                    </h3>
                    <span className='error_boundary_speech'>
                        You crashed me man... <br />
                        Look
                    </span> 
                    <Link 
                        onClick={() => this.resetHandler()} 
                        className='error_boundary_body'
                        to='/playlist'>
                            <img 
                                src={errorImage} 
                                alt="error" 
                                className='error_boundary_body_image'/>
                            <span className='error_boundary_body_button'>
                                Let's go home
                            </span>
                    </Link> 
                </div>
            )
        }
    
        return this.props.children;   
    }
}
