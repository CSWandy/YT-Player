import React from 'react';

import spinner from '../../../assets/icons/png/spinner.png';
import './_imgFailProne.scss';

const ImgFailProne = (props) => {

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

export default ImgFailProne