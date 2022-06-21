import React from 'react';

import Switch from '../Switch/Switch';
import spinnerIco from '../../../assets/icons/png/spinner.png';

import './_spinner.scss';

const Spinner = (props) => {

    const {
        qty,
        parent="default",
        type, 
        showDesc = true, 
        showChannel = true, 
    } = props;

    const spinnerImg = [...Array(qty)].map( (item, index) => 
        <img src={spinnerIco} alt="Spinner" className='spinner_instance' key={`spinner_${index}`} />);

    return (
        <Switch switchKey={parent} throwProps={props}>

            <div case={"ThumbnailPlaylist"} >
                { [...Array(qty)].map( (item, index) => 
                    <div className={`spinner`} key={`spinner_${index}`}>
                        <section className={'horizontal_thumbnail'} >
                            <div className={'spinner_rotation_'+index+' horizontal_thumbnail_head'}>
                                <img className='horizontal_thumbnail_head_image_spinner spinner_rotation' src={spinnerIco} alt={props.type+'spinner'} />
                            </div>
                            <div className='horizontal_thumbnail_description'>
                                <h3 className='horizontal_thumbnail_description_title_spinner'>Lorem ipsum dolore</h3>
                                <div className='horizontal_thumbnail_description_text_spinner'>
                                    <span>{document.documentElement.clientWidth > 768 ?
                                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum laboriosam doloremque temporibus fugit quas iure asperiores possimus, veniam nemo tenetur optio amet dolor similique odio suscipit dolorum, molestias reiciendis assumenda.'
                                    :'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>)
                }
            </div>

            <div case={"Thumbnail"} className={(type === 'grid')? 'screen_grid' : ''}>
                { [...Array(qty)].map( (item, index) => 
                    <section  className={'thumbnail_'+type} key={`spinner_${index}`}>
                        <div className={'thumbnail_'+type+'_head thumbnail_grid_head_spinner spinner_rotation_'+index}>
                            <img src={spinnerIco} 
                                 alt={props.type+'spinner'} 
                                 className={'thumbnail_horizontal_head_image_spinner thumbnail_grid_head_spinner_image spinner_rotation'}/>
                        </div>
            
                        <div className={'thumbnail_'+type+'_description'}>
                            <h3 className={'thumbnail_'+type+'_description_title scribble'}>Lorem ipsum dolor</h3>
                            <div className={'thumbnail_'+type+'_description_stats scribble'}>
                                Lorem ipsum  
                            </div>
                            
                            {showChannel && 
                            (<div className={'thumbnail_'+type+'_channel'} >
                                <img src={spinnerIco} alt={props.type+'spinner channel'} className={'thumbnail_'+type+'_channel_image_spinner spinner_rotation'}/>
                                <h4 className={'thumbnail_'+type+'_channel_title scribble'}>Lorem ipsum  </h4>
                            </div> )}
            
                            {showDesc && 
                            <div className={'thumbnail_'+type+'_description_text scribble'} >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum laboriosam                     
                            </div> }
                        </div>
                    </section> )
                }
            </div>

            <div case={"default"} className={`spinner spinner_qty${qty}`}>
                {spinnerImg}
            </div>

        </Switch>
    )
}

export default Spinner


        