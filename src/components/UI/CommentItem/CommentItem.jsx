import React, { memo } from 'react';
import moment from 'moment';

import ImgFallback from '../ImgFallback/ImgFallback';

import './_commentItem.scss';

const CommentItem = ( { comment } ) => {

    const { 
        topLevelComment: {
            totalReplyCount,
            snippet: {
                authorDisplayName,
                authorProfileImageUrl,
                publishedAt,
                textOriginal,
                likeCount,
            }
        }
     } = comment;

  return (
    <div className='player_comments_list_item'>
         <div className='player_comments_list_item_side'>
            <ImgFallback 
                src={authorProfileImageUrl}
                alt='avatar'
                className='player_comments_list_item_side_image' />
            {!!likeCount && 
            <span className='player_comments_list_item_side_likes'>
               {likeCount} {(likeCount === 1)? 'Like' : 'Likes'}
            </span>}
        </div>

         <div className='player_comments_list_item_body'>
            <h6 className='player_comments_list_item_body_title'>
               {authorDisplayName}
            </h6>
            <span className='player_comments_list_item_body_stats'>
              {moment(publishedAt).format("MMM Do YYYY")}
            </span>
            <p className='player_comments_list_item_body_text'>{textOriginal}</p>
            {!!totalReplyCount && 
                <p className='player_comments_list_item_body_replies'>{totalReplyCount} replies</p>}
         </div>
      </div>
  )
}

export default memo(CommentItem)