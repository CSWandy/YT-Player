import { useState, useContext, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ChannelPageHeader from '../../UI/ChannelPageHeader/ChannelPageHeader';
import CardVideo from '../../UI/CardVideo/CardVideo';
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';

import useSetTitle from '../../../hooks/useSetTitle';
import { getChannelDetails, getPlaylistItems } from '../../../API/requestListAPI';
import { pageUp } from '../../../utils/pageUp';

const Channel = () => {
    const { channelId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [channelItem, setChannelItem] = useState();
    const [videoList, setVideoList ] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { setLayout } = useContext(LayoutContext);

    useEffect(() => {
        const async = async () => {
            try {
                pageUp();
                setIsLoading(true);

                const channel = await getChannelDetails(channelId);
                const channelItem = channel.data.items[0];
                setChannelItem(channelItem);
                
                const channelPlId = (channelItem.contentDetails.relatedPlaylists.uploads);
                const channelPl = await getPlaylistItems(channelPlId);
                setVideoList(channelPl.data.items); 

                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, [channelId]);

    useSetTitle('channel', channelItem?.snippet?.title, [channelItem], setLayout);

    return (
        <>
            <ChannelPageHeader channelItem={channelItem} channelId={channelId}/>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2100} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        appear={true} 
                        nodeRef={transitionNodeRef}>  
                <div ref={transitionNodeRef} className='transition_pos_abs'>
                    <LoadingPlaceholder 
                        quantity={10}
                        placeholderType='CardVideo'
                        subType='grid'/>
                </div>  
            </CSSTransition>
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} className='screen_grid'> 
                    {videoList.map(video => 
                        (<CardVideo video={video}
                                    key={video.snippet.resourceId.videoId}
                                    layout="grid"
                                    idSrc="snippet"
                                    playlistId={channelItem.contentDetails.relatedPlaylists.uploads}
                                    showChannel={false}/>))}
                </div>
            </CSSTransition>
        </>
    )
}

export default Channel
