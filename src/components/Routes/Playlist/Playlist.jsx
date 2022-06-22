import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ThumbnailPlaylist from '../../UI/ThumbnailPlaylist/ThumbnailPlaylist';
import Thumbnail from '../../UI/Thumbnail/Thumbnail';
import Spinner from '../../UI/Spinner/Spinner';

import apiRequest from '../../../utils/apiRequest'; 
import useFetch from '../../../utils/useFetch';

const Playlist = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [Pl, setPl] = useState({});
    const [vids, setVids ] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { setLayout } = useContext(LayoutContext);
    const { playlistId } = useParams();

    const doFetch = async playlistId => {
        const { data: { items } } = 
            await apiRequest.get('/playlists', 
                { params: {
                    part: 'contentDetails,snippet',
                    id: playlistId
                    }
                });

        const PlVids = await apiRequest.get('/playlistItems', 
            { params: {
                part: 'snippet, contentDetails',
                maxResults: 30,
                playlistId:playlistId,
                }
            });
        
        setPl(items[0]);
        setVids(PlVids.data.items); 
    };

    useFetch(doFetch, playlistId, setIsLoading, [playlistId], true);

    useEffect(() => {
        setLayout(prev => ({...prev, menuActive:`Playlists - ${Pl?.snippet?.localized?.title ? Pl.snippet.localized.title : ''}`})); 
        document.title = `Playlists - ${Pl?.snippet?.localized?.title ? Pl.snippet.localized.title : ''}`;
    }, [Pl]);
    
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
                    <Spinner 
                            qty={1} 
                            parent={"ThumbnailPlaylist"}
                            type='playlist' 
                            key="spinner_playlist"/>
                    <Spinner 
                            qty={6}
                            parent={"Thumbnail"}
                            type='horizontal'
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
                    <ThumbnailPlaylist  
                                    object={Pl}
                                    type='playlist'
                                    key={Pl.id}
                                    activeLink={false}
                                    lines={7} />
                    {vids.map(video => (
                    <Thumbnail  
                            video={video}
                            key={video.snippet.resourceId.videoId}
                            type="horizontal"
                            idSrc="snippet" 
                            plId={playlistId}/>))}

                </div>
            </CSSTransition>
        </div>
    )
}

export default Playlist


            