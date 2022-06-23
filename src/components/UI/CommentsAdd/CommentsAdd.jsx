import React, { useContext, useState } from 'react';
import { LayoutContext } from '../../../contexts/LayoutContext';

import ImgFailProne from '../ImgFailProne/ImgFailProne';
import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';

import './_commentsAdd.scss';

const CommentsAdd = ( { videoId } ) => {
    
    const [text, setText] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { layout: { menuActive }, setLayout } = useContext(LayoutContext);

    const doFetch = async () => {      
        const { data } = 
            await apiRequest.get('/channels', {
                params: {
                    part: 'snippet',
                    mine: true,
                },
                withToken: true
            });

        setAvatar(data.items[0].snippet.thumbnails);
    };

    useFetch(doFetch, null, setIsLoading, [menuActive]);

    const addCommentHandler = e => {
        e.preventDefault();
        if (text.length === 0) return

        const obj = {
            snippet: {
                videoId: videoId,
                topLevelComment: {
                    snippet: {
                        textOriginal: text,
                    },
                },
            },
        };

        const addComment = () => {
            try {
                apiRequest.post('/commentThreads', 
                    obj, 
                    { params: 
                        { part: 'snippet' },
                    withToken: true });
            } catch(error) {
                console.log(error);
            }
        }; 
        
        addComment();
        setText('');
    };

    return (
        !isLoading && 
        <>
            <div className='player_comments_add'>
                <ImgFailProne 
                    src={avatar?.default?.url} 
                    alt='avatar' 
                    className='player_comments_add_avatar' />
                <form onSubmit={addCommentHandler} className='player_comments_add_form'>
                    <input
                        type='text'
                        className='player_comments_add_form_input'
                        placeholder='Add comment...'
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button className='player_comments_add_form_submit'>Comment</button>
                </form>
            </div>
            
        </>
    )
}

export default CommentsAdd