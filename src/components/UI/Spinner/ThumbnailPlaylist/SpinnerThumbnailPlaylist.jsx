import React from 'react';

import spinnerIco from '../../../../assets/images/png/spinner.png';

const SpinnerThumbnailPlaylist = (props) => {

    const {
        type, 
        index, 
        showDesc = true, 
        showChannel = true 
    } = props;
    
    return (
        <section  className={'thumbnail_'+type} >
            <div className={'thumbnail_'+type+'_head thumbnail_grid_head_spinner spinner_rotation_'+index}>
                <img src={spinnerIco} 
                    alt={type+'spinner'} 
                    className={'thumbnail_horizontal_head_image_spinner thumbnail_grid_head_spinner_image spinner_rotation'}/>
            </div>

            <div className={'thumbnail_'+type+'_description'}>
                <h3 className={'thumbnail_'+type+'_description_title scribble'}>Lorem ipsum dolor</h3>
                <div className={'thumbnail_'+type+'_description_stats scribble'}>
                    Lorem ipsum  
                </div>
                
                {showChannel && 
                (<div className={'thumbnail_'+type+'_channel'} >
                    <img src={spinnerIco} alt={type+'spinner channel'} className={'thumbnail_'+type+'_channel_image_spinner spinner_rotation'}/>
                    <h4 className={'thumbnail_'+type+'_channel_title scribble'}>Lorem ipsum  </h4>
                </div> )}

                {showDesc && 
                <div className={'thumbnail_'+type+'_description_text scribble'} >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum laboriosam                     
                </div> }
            </div>
        </section> 
  )
}

export default SpinnerThumbnailPlaylist