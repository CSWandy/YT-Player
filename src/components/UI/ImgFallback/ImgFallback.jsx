import React from 'react';

import spinner from '../../../assets/images/png/spinner.png';

import './_imgFallback.scss';

const ImgFallback = (props) => {
        const {children, ...htmlAttributes } = props;

        const errorHandler = ({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = spinner; 
            currentTarget.dataset.failed = true;
        };

    return (
        <img {...htmlAttributes} onError={errorHandler}>
            {children}
        </img>
    )
}

export default ImgFallback