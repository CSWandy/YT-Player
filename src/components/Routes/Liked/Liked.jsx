import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import Thumbnail from '../../UI/Thumbnail/Thumbnail';
import Spinner from '../../UI/Spinner/Spinner';

import apiRequest from '../../../utils/apiRequest';
import { googleLogout } from '@react-oauth/google'; 

const Liked = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [vids, setVids ] = useState([]);
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { layout: { menuActive }, setLayout } = useContext(LayoutContext);

    useEffect(() => {
        setLayout(prev => ({...prev, menuActive: `Liked`}));
        document.title = 'Liked';
    }, []);

    useEffect(() => {
        setIsLoading(true);

        const doFetch = async () => {
            try {
                const { data: { items } } = 
                    await apiRequest.get('/videos', 
                        { params: {
                            part: 'contentDetails,statistics,snippet',
                            maxResults: 15, 
                            myRating: 'like'}
                        });
                setVids(items);
                setIsLoading(false);
            } catch (error) {
                localStorage.setItem('token','');
                setLayout(prev => ({...prev, loggedIn:false }));
                googleLogout();
            }         
        };

        doFetch();
    }, [menuActive]);

    return ( 
    <>
        <h2>Liked videos:</h2>
        <CSSTransition  in={isLoading} 
                        timeout={2000} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        appear={true} 
                        nodeRef={transitionNodeRef}>  
            <div ref={transitionNodeRef} className='transition_container transition_pos_abs'>
                <Spinner qty={10}
                         parent={"Thumbnail"}
                         type='grid'/>
            </div>  
        </CSSTransition>
        <CSSTransition  in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
            <div ref={transitionNodeRef2} className='screen_grid'>
                {(vids?.map(video => 
                    (<Thumbnail video={video}
                                key={video.id}
                                type="grid" />))) }

            </div>
        </CSSTransition>
        </>
    )
}

export default Liked
