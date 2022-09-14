import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CommentItem from '../CommentItem/CommentItem';
import CommentAdd from '../CommentAdd/CommentAdd';
 
import { getCommentsList } from '../../../API/requestListAPI';

import './_comments.scss';
import LoadingPlaceholder from '../LoadingPlaceholder/LoadingPlaceholder';

const Comments = ( { videoId, totalComments } ) => {
    const [comments, setComments] = useState({ items: [], nextPageToken: '' });
    const [isLoading, setIsLoading] = useState(true);   
    const [error, setError] = useState('');
    const paginationObserver = useRef(); 

    const loadComments = async () => {
        try {
            setIsLoading(true);
            const commentsList = await getCommentsList(videoId, comments.nextPageToken);
            const nextPageToken = commentsList.data.nextPageToken;
            const items = [...comments.items, ...commentsList.data.items]; 
            setComments({ items, nextPageToken });
            setIsLoading(false);
        } catch(error) {
            if (error?.response?.status == 403) {
                setIsLoading(false);
                setError('Comments disabled for this video');
            }
            const message = error?.response?.data?.error?.message || error;
            console.log(message);
        }
    };

    useEffect(() => {
        loadComments();
    }, []);

    // scroll pagination Intersection observer
    const lastNode = useCallback(lastNode => {
        if (isLoading || !comments.nextPageToken) return
        if (paginationObserver.current) paginationObserver.current.disconnect(); 
        paginationObserver.current = 
            new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) loadComments();
            });
        if (lastNode) paginationObserver.current.observe(lastNode);
    }, [isLoading]); 

    const commentList = useMemo(() => ( 
        comments.items.map((item, index, array) => { 
            const commentItem = <CommentItem comment={item.snippet} key={item.id} />;
            const isLast = (index === array.length - 1); 
            if (isLast) return <div ref={lastNode} key={item.id}> {commentItem} </div>  
            return commentItem
        })
    ), [comments]);  

return (
    <section className='player_comments'>
         <>
            {!!totalComments && !error && 
            <h5 className='player_comments_total'>{totalComments} Comments </h5>}
            
            {!error && 
            <CommentAdd videoId={videoId}/>}
            
            <div className='player_comments_list'>
                {commentList}
                {error && <p className='player_comments_error'> {error} </p>}
            </div>

            {isLoading && <LoadingPlaceholder/>}
        </>
      </section>
  )
}

export default Comments