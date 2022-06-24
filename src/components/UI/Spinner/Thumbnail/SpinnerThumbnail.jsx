import React from 'react';

import spinnerIco from '../../../../assets/images/png/spinner.png';

const SpinnerThumbnail = ({index, type}) => {
  return (
    <div className={`spinner`} >
        <section className={'horizontal_thumbnail'} >
            <div className={'spinner_rotation_'+index+' horizontal_thumbnail_head'}>
                <img className='horizontal_thumbnail_head_image_spinner spinner_rotation' src={spinnerIco} alt={type+'spinner'} />
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
    </div>
  )
}

export default SpinnerThumbnail