import React, { useContext, useEffect, useState } from 'react';

import { LayoutContext } from '../../../contexts/LayoutContext';
import CommentItem from '../CommentItem/CommentItem';
import CommentsAdd from '../CommentsAdd/CommentsAdd';

import { googleLogout } from '@react-oauth/google';
import apiRequest from '../../../utils/apiRequest';
import throttle from '../../../utils/throttle';

import './_comments.scss';

const Comments = ( { videoId, totalComments } ) => {
    
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);    
    const [nextPage, setNextPage] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);
    const [fireFetch, setFireFetch] = useState(true);
    const { setLayout } = useContext(LayoutContext);

    useEffect(() => {
        const doFetch = async videoId => {
            try {
                setIsLoading(true);
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
                setIsLoading(false);
                setFireFetch(false);
            } catch (error) {
                localStorage.setItem('token','');
                setLayout(prev => ({...prev, loggedIn:false }));
                googleLogout();
            }     
        };
        
        if (fireFetch && !isLastPage) doFetch(videoId);
    }, [fireFetch]);

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
                {comments?.map((comment) => (
                    <CommentItem comment={comment.snippet} key={comment.id} />
                ))}
            </div>
         </>}
      </section>
  )
}

export default Comments