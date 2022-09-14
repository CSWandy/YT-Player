import React, { useContext, useEffect, useState } from 'react';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ImgFallback from '../ImgFallback/ImgFallback';

import { getMyChannelDetails, postComment } from '../../../API/requestListAPI';

import './_commentAdd.scss';

const CommentAdd = ( { videoId } ) => {
    const [text, setText] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const {layout: { loggedIn } } = useContext(LayoutContext);

    useEffect(() => {
        const async = async () => {
            try {
                setIsLoading(true);
                const accountDetails = await getMyChannelDetails();
                setAvatar(accountDetails.data.items[0].snippet.thumbnails);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, [loggedIn]);

    const addCommentHandler = async e => {
        e.preventDefault();
        if (text.length === 0) return
        try {
            const payload = {
                snippet: {
                    videoId: videoId,
                    topLevelComment: {
                        snippet: {
                            textOriginal: text,
                        },
                    },
                },
            };
            await postComment(payload);
            setError('');
            setText('');
        } catch(error) {
            if (error?.response?.status == 403) {
                setError('No permission for posting comments. Please, ensure to allow all checks via login.')
            }
            console.log(error);
        }
    };

    return (
        loggedIn && 
        <>
            <div className='player_comments_add'>
                <ImgFallback 
                    src={avatar?.default?.url || ''} 
                    alt='avatar' 
                    className='player_comments_add_avatar' />
                <form onSubmit={addCommentHandler} className='player_comments_add_form'>
                    <input
                        type='text'
                        className='input'
                        placeholder='Add comment...'
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button className='submit'>Comment</button>
                    {error && 
                    <p className='error'> {error} </p>}
                </form>
            </div>
        </>
    )
}

export default CommentAdd