import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ChannelScreenHeader from '../../UI/ChannelScreenHeader/ChannelScreenHeader';
import Thumbnail from '../../UI/Thumbnail/Thumbnail';
import Spinner from '../../UI/Spinner/Spinner';

import useFetch from '../../../utils/useFetch';
import apiRequest from '../../../utils/apiRequest';

const Channel = () => {
    const { channelId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [channelItem, setChannelItem] = useState();
    const [vids, setVids ] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { setLayout } = useContext(LayoutContext);

    useEffect( () => {
        setLayout(prev => ({...prev, menuActive:`Channel - ${channelItem?.snippet?.title ? channelItem.snippet.title : ''}`})); 
        document.title = `Channel - ${channelItem?.snippet?.title ? channelItem.snippet.title : ''}`;
    }, [channelItem]);

    
    const doFetch = async channelId => {
        const { data: { items } } = 
            await apiRequest.get('/channels', 
                { params: {
                    part: 'snippet,contentDetails,statistics',
                    id: channelId
                    }
                });

        setChannelItem(items[0]);
        const channelPlId = (items[0].contentDetails.relatedPlaylists.uploads);
        const { data } = await apiRequest.get('playlistItems', 
            { params: {
                    part: 'snippet, contentDetails',
                    maxResults: 30,
                    playlistId:channelPlId,
                    }
            });

        setVids(data.items); 
    };

    useFetch(doFetch, channelId, setIsLoading, [channelId]);

    return (
        <>
            <ChannelScreenHeader channelItem={channelItem} channelId={channelId}/>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2000} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        appear={true} 
                        nodeRef={transitionNodeRef}>  
                <div ref={transitionNodeRef} className='transition_container transition_pos_abs'>
                    <Spinner 
                        qty={10}
                        parent={"Thumbnail"}
                        type='grid'/>
                </div>  
            </CSSTransition>
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} className='screen_grid'> 
                    {vids.map(video => 
                        (<Thumbnail video={video}
                                    key={video.snippet.resourceId.videoId}
                                    type="grid"
                                    idSrc="snippet"
                                    plId={channelItem.contentDetails.relatedPlaylists.uploads}
                                    showChannel={false}/>))}
                </div>
            </CSSTransition>
        </>
    )
}

export default Channel
