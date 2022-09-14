import React from 'react';

import Switch from '../Switch/Switch';
import PlaceholderCard from './CardVideo/PlaceholderCard';
import PlaceholderCardPlaylist from './CardPlaylist/PlaceholderCardPlaylist';

import spinnerIco from '../../../assets/images/png/spinner.png';

import './_placeholder.scss';

const LoadingPlaceholder = (props) => {

    const {
        quantity = 1,
        placeholderType='default',
        subType, 
        showDesc = true, 
        showChannel = true, 
    } = props;

    return (
        <Switch switchKey={placeholderType}>

            <div case='CardPlaylist' >
                { [...Array(quantity)].map( (_, index) => 
                    <PlaceholderCardPlaylist key={`Placeholder_${index}`} index={index} {...props}/> )
                }
            </div>

            <div case='CardVideo' className={(subType === 'grid')? 'screen_grid' : ''}>
                { [...Array(quantity)].map( (_, index) => 
                    <PlaceholderCard key={`placeholder_${index}`} index={index} {...props}/> )
                }
            </div>

            <div case='default' className={`placeholder placeholder_quantity${quantity}`}>
                {[...Array(quantity)].map( (_, index) => 
                    <img src={spinnerIco} alt="spinner" className='placeholder_instance default' key={`spinner_${index}`} />)}
            </div>

        </Switch>
    )
}

export default LoadingPlaceholder


        