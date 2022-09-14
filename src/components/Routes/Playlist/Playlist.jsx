import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import CardVideo from '../../UI/CardVideo/CardVideo'; 
import CardPlaylist from '../../UI/CardPlaylist/CardPlaylist';
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';

import { pageUp } from '../../../utils/pageUp';
import { getPlaylistDetails, getPlaylistItems } from '../../../API/requestListAPI';
import useSetTitle from '../../../hooks/useSetTitle';

const Playlist = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [Pl, setPl] = useState({});
    const [videoList, setVideoList ] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { setLayout } = useContext(LayoutContext);
    const { playlistId } = useParams();
 
    useEffect(() => {
        const async = async () => {
            try {
                pageUp();
                setIsLoading(true);
                const playlistDetails = await getPlaylistDetails(playlistId);
                const PlaylistVideoList = await getPlaylistItems(playlistId);
                setPl(playlistDetails.data.items[0]);
                setVideoList(PlaylistVideoList.data.items); 
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, [playlistId]);

    useSetTitle('playlist', Pl?.snippet?.localized?.title, [Pl], setLayout);
    
    return (
        <div className='screen_horizontal'>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2100} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        appear={true} 
                        nodeRef={transitionNodeRef}>  
                <div ref={transitionNodeRef} className='transition_pos_abs'>
                    <LoadingPlaceholder 
                            quantity={1} 
                            placeholderType='CardPlaylist'
                            subType='playlist' 
                            key="spinner_playlist"/>
                    <LoadingPlaceholder 
                            quantity={6}
                            placeholderType='CardVideo'
                            subType='horizontal'
                            key="spinner_videos"/>
                </div>  
            </CSSTransition>
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} >
                    <CardPlaylist  
                                object={Pl}
                                key={Pl.id}
                                activeLink={false}
                                lines={7} />
                    {videoList.map(video => (
                        <CardVideo  
                                video={video}
                                key={video.snippet.resourceId.videoId}
                                layout="horizontal"
                                idSrc="snippet" 
                                playlistId={playlistId}/>))}
                </div>
            </CSSTransition>
        </div>
    )
}

export default Playlist


            