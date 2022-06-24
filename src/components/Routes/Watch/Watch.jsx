import React, { useCallback, useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import merge from 'deepmerge';

import PlayerDesc from '../../UI/PlayerDesc/PlayerDesc';
import PlaylistBox from '../../UI/PlaylistBox/PlaylistBox';
import Comments from '../../UI/Comments/Comments';
import { LayoutContext } from '../../../contexts/LayoutContext';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';
import useSetTitle from '../../../utils/useSetTitle';

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
    const location = useLocation();
    const [videoObject, setVideoObject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { setLayout } = useContext(LayoutContext);

    const locationHash = location.hash.slice(1);
    
    if (locationHash) {
        playerConfig = merge(playerConfig, {youtube: { playerVars: { listType:"playlist", list:locationHash }}});
    }

    const doFetch = useCallback( async vidId => {
        const { data : { items } } = 
            await apiRequest.get('/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    id: vidId,
                }
            });
        
        const history = localStorage.getItem('history');
        if (history.split(',')[0] !== vidId){
            localStorage.setItem('history', vidId + ',' + history);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setVideoObject(items[0]);
    }, []);

    useFetch(doFetch, [vidId], setIsLoading, [vidId], true);
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
                <PlaylistBox plId={locationHash} vidId={vidId}/>
            </div>
        </>)
    )
}

export default Watch


