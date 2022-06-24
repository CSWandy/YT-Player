import React from 'react';

import Switch from '../Switch/Switch';
import SpinnerThumbnail from './Thumbnail/SpinnerThumbnail';
import SpinnerThumbnailPlaylist from './ThumbnailPlaylist/SpinnerThumbnailPlaylist';

import spinnerIco from '../../../assets/images/png/spinner.png';

import './_spinner.scss';

const Spinner = (props) => {

    const {
        qty,
        parent="default",
        type, 
        showDesc = true, 
        showChannel = true, 
    } = props;

    return (
        <Switch switchKey={parent} throwProps={props}>

            <div case={"ThumbnailPlaylist"} >
                { [...Array(qty)].map( (item, index) => 
                    <SpinnerThumbnail key={`spinner_${index}`} index={index} {...props}/> )
                }
            </div>

            <div case={"Thumbnail"} className={(type === 'grid')? 'screen_grid' : ''}>
                { [...Array(qty)].map( (item, index) => 
                    <SpinnerThumbnailPlaylist key={`spinner_${index}`} index={index} {...props}/> )
                }
            </div>

            <div case={"default"} className={`spinner spinner_qty${qty}`}>
                {[...Array(qty)].map( (item, index) => 
                    <img src={spinnerIco} alt="Spinner" className='spinner_instance' key={`spinner_${index}`} />)}
            </div>

        </Switch>
    )
}

export default Spinner


        