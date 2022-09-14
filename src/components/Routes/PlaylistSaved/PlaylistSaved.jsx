import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import CardPlaylist from '../../UI/CardPlaylist/CardPlaylist';
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';

import useSetTitle from '../../../hooks/useSetTitle';
import { getPlaylistDetails } from '../../../API/requestListAPI';
import { pageUp } from '../../../utils/pageUp';

const PlaylistSaved = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [Pl, setPl] = useState([]);    
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { setLayout } = useContext(LayoutContext);
    const savedPl = JSON.parse(localStorage.getItem('savedPlaylists')).join();
 
    useEffect(() => {
        const async = async () => {
            try {
                pageUp();
                setIsLoading(true);
                const playlistDetails = await getPlaylistDetails(savedPl);
            setPl(playlistDetails.data.items);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, []);
    
    useSetTitle('playlists', '', [], setLayout);

    return (
        <div className='screen_horizontal'> 
            <h2>Saved playlists:</h2>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2100} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef}>   
                <div ref={transitionNodeRef}  className="transition_pos_abs">
                    <LoadingPlaceholder 
                            quantity={4}
                            placeholderType='CardPlaylist'
                            subType='playlist' />
                </div>      
            </CSSTransition >
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} >
                    {Pl.map(pl => 
                        ( <CardPlaylist object={pl}
                                        key={pl.id}
                                        lines={8}/>))}
                </div> 
            </CSSTransition >
        </div>
    )
}

export default PlaylistSaved

