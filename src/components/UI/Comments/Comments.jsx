import React, { useCallback, useEffect, useState } from 'react';

import CommentItem from '../CommentItem/CommentItem';
import CommentsAdd from '../CommentsAdd/CommentsAdd';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';
import throttle from '../../../utils/throttle';

import './_comments.scss';

const Comments = ( { videoId, totalComments } ) => {
    
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);    
    const [nextPage, setNextPage] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);
    const [fireFetch, setFireFetch] = useState(true);

    const doFetch = useCallback( async (videoId, nextPage) => {
        if (fireFetch && !isLastPage) { 
            const { data } = await apiRequest.get('/commentThreads', {
                    params: {
                        part: 'snippet',
                        videoId: videoId,
                        pageToken: nextPage,
                    },
                }); 

            setComments([...comments, ...data.items]);
            if (data.nextPageToken) {
                setNextPage(data.nextPageToken);
            } else {
                setNextPage('');
                setIsLastPage(true);
            }
            setFireFetch(false);
        }
    }, [fireFetch, isLastPage, comments]);

    useFetch(doFetch, [videoId, nextPage], setIsLoading, [fireFetch], false);

    useEffect( () =>  { 
        document.addEventListener('scroll',  scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler)
    }, []);

    const scrollHandler = throttle(function(e) {
        console.log('handling');
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 50)) {
                setFireFetch(true);
        }
    }, 2000);
    
return (
    <section className='player_comments'>
         {!isLoading && 
         <>
            {comments && <h5 className='player_comments_total'>{totalComments} Comments </h5>}
            <CommentsAdd videoId={videoId}/>
            <div className='player_comments_list'>
                {comments?.map((comment) => 
                    (<CommentItem comment={comment.snippet} key={comment.id} />))}
            </div>
         </>}
      </section>
  )
}

export default Comments