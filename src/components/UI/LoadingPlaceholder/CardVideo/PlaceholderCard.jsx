import React from 'react';

import spinnerIco from '../../../../assets/images/png/spinner.png';

const PlaceholderCard = (props) => {

    const {
        subType, 
        index, 
        showDesc = true, 
        showChannel = true 
    } = props;
    
    return (
        <section  className={'video-card_'+subType} >
            <div className={'video-card_'+subType+'_head video-card_grid_head_spinner spinner_rotation_'+index}>
                <img src={spinnerIco} 
                    alt={subType+'spinner'} 
                    className={'video-card_horizontal_head_image_spinner video-card_grid_head_spinner_image spinner_rotation'}/>
            </div>

            <div className={'video-card_'+subType+'_description'}>
                <h3 className={'video-card_'+subType+'_description_title scribble'}>Lorem ipsum dolor</h3>
                <div className={'video-card_'+subType+'_description_stats scribble'}>
                    Lorem ipsum  
                </div>
                
                {showChannel && 
                (<div className={'video-card_'+subType+'_channel'} >
                    <img src={spinnerIco} alt={subType+'spinner channel'} className={'video-card_'+subType+'_channel_image_spinner spinner_rotation'}/>
                    <h4 className={'video-card_'+subType+'_channel_title scribble'}>Lorem ipsum  </h4>
                </div> )}

                {showDesc && 
                <div className={'video-card_'+subType+'_description_text scribble'} >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum laboriosam                     
                </div> }
            </div>
        </section> 
  )
}

export default PlaceholderCard