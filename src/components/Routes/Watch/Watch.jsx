import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import merge from 'deepmerge';

import PlayerDesc from '../../UI/PlayerDesc/PlayerDesc';
import PlaylistBox from '../../UI/PlaylistBox/PlaylistBox';
import Comments from '../../UI/Comments/Comments';
import { LayoutContext } from '../../../contexts/LayoutContext';

import { pageUp } from '../../../utils/pageUp';
import { getVideoDetails } from '../../../API/requestListAPI';
import useSetTitle from '../../../hooks/useSetTitle';

import './_watch.scss';

const Watch = () => {

    let playerConfig = { 
        youtube: {
            playerVars: {  
                cc_load_policy: 0,
                color: 'white',
                controls: 1,
                disablekb: 0,
                hl: 'en',
                iv_load_policy: 3,
                rel: 0, 
            },
            embedOptions: {
                height: '100%',
                width: '100%',
            }
        }
    };
    
    const { vidId } = useParams();
    const url = useLocation();
    const [videoObject, setVideoObject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { setLayout } = useContext(LayoutContext);

    const urlHash = url.hash.slice(1);
    if (urlHash) {
        playerConfig = merge(playerConfig, {youtube: { playerVars: { listType:"playlist", list:urlHash }}});
    }

    const updateHistory = () => {
        const history = JSON.parse(localStorage.getItem('history'));
        if (history[0] !== vidId) {
            const newHistory = JSON.stringify([vidId, ...history]);
            localStorage.setItem('history', newHistory);
        }
    }; 

    useEffect(() => {
        const async = async () => {
            try {
                pageUp();
                setIsLoading(true);
                const vidDetails = await getVideoDetails(vidId);
                updateHistory();
                setVideoObject(vidDetails.data.items[0]);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, [vidId]);


    useSetTitle('watch', videoObject?.snippet?.title, [videoObject], setLayout);

    return (
        !isLoading && 
        (<> 
            <div className="player">
                <ReactPlayer 
                            url={`https://www.youtube.com/embed/${vidId}`} 
                            playing={true}
                            controls={true}
                            width='100%'
                            height='100%'
                            config={playerConfig} />
            </div>
                <PlayerDesc video={videoObject}/>
            <div className='player_bottom'>
                <Comments   
                        videoId={vidId}
                        totalComments={videoObject.statistics.commentCount}/>
                <PlaylistBox playlistId={urlHash} videoId={vidId}/>
            </div>
        </>)
    )
}

export default Watch


