import React from 'react';
import parse from 'html-react-parser';

import { useNavigate } from "react-router-dom";

import './_thumbnailPlaylistMini.scss';

const ThumbnailPlaylist = ({ object}) => {
    const {
        id,
        snippet: {
            title,
            thumbnails: { default:thumbnailDefault },
        }
    } = object;

    const navigate = useNavigate();

    const thumbnailLinkHandler = () => {
        navigate(`/playlist/${id}`);
    };

  return (
    <section className={'horizontal_thumbnail_mini'} >
      <img className={'horizontal_thumbnail_mini_image_playlist horizontal_thumbnail_image_link'} src={thumbnailDefault.url} alt={'playlist'+title} onClick={thumbnailLinkHandler}/>
      <div className='horizontal_thumbnail_mini_description'>
         <h3 className='horizontal_thumbnail_mini_description_title'>{parse(title)}</h3>
      </div>
    </section>
    )
}

export default ThumbnailPlaylist