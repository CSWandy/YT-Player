import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import CardVideo from '../../UI/CardVideo/CardVideo';
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';

import { pageUp } from '../../../utils/pageUp';
import { getLikedVideoDetails } from '../../../API/requestListAPI';
import useSetTitle from '../../../hooks/useSetTitle';

const Liked = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [vids, setVids ] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { layout: { loggedIn }, setLayout } = useContext(LayoutContext);
 
    useEffect(() => {
        const async = async () => {
            try {
                pageUp();
                setIsLoading(true);
                const { data: { items } } = await getLikedVideoDetails();
                setVids(items); 
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, [loggedIn]);

    useSetTitle('liked', '', [], setLayout);

    return ( 
    <>
        <h2>Liked videos:</h2>
        <CSSTransition  
                    in={isLoading} 
                    timeout={2000} 
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
                {(vids?.map(video => 
                    (<CardVideo 
                            video={video}
                            key={video.id}
                            layout="grid" />))) }

            </div>
        </CSSTransition>
        </>
    )
}

export default Liked

