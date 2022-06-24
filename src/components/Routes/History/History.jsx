import React, { useState, useRef, useContext, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import Thumbnail from '../../UI/Thumbnail/Thumbnail';
import Spinner from '../../UI/Spinner/Spinner';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';
import useSetTitle from '../../../utils/useSetTitle';

const History = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [vids, setVids] = useState([]);
    const nodeRef = useRef();
    const nodeRef2 = useRef();
    const { layout: { menuActive }, setLayout } = useContext(LayoutContext);
    const history = localStorage.getItem('history').split(',').filter(id => (id !== 'undefined'));


    const doFetch = useCallback( async history => {
        const { data } = await apiRequest.get('/videos', {
            params: {
                part: 'contentDetails,statistics,snippet',
                id: history.slice(0, 15).join(',')
            }
        });

        setVids(data.items);
    }, []);

    useSetTitle('history', '', [], setLayout);
    useFetch(doFetch, [history], setIsLoading, [menuActive], true);

    return (
    <div className='screen_horizontal'> 
        <h2>History:</h2>
        <CSSTransition  
                    in={isLoading} 
                    timeout={2100} 
                    classNames="transition_spinner" 
                    unmountOnExit 
                    nodeRef={nodeRef}>   
            <div ref={nodeRef} className='transition_pos_abs'>
                <Spinner 
                        qty={4}
                        parent={"Thumbnail"}
                        type='horizontal' />
            </div>      
        </CSSTransition >
        <CSSTransition  
                    in={!isLoading} 
                    timeout={2100} 
                    classNames="transition" 
                    unmountOnExit 
                    nodeRef={nodeRef2}> 
            <div ref={nodeRef2}>
                {vids.map((video, index) => 
                    (<Thumbnail 
                            video={video}
                            key={video.id+index}
                            type="horizontal" />))}
            </div> 
        </CSSTransition >
    </div>
  )
}

export default History



