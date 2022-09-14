import React, { useState, useRef, useContext, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import CardVideo from '../../UI/CardVideo/CardVideo';
import LoadingPlaceholder from '../../UI/LoadingPlaceholder/LoadingPlaceholder';

import { getVideoDetails } from '../../../API/requestListAPI';
import useSetTitle from '../../../hooks/useSetTitle';
import { pageUp } from '../../../utils/pageUp';

const History = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [vids, setVids] = useState([]);
    const nodeRef = useRef();
    const nodeRef2 = useRef();
    const { setLayout } = useContext(LayoutContext);
    const history = JSON.parse(localStorage.getItem('history'));

    useEffect(() => {
        const async = async () => {
            try {
                pageUp();
                setIsLoading(true);
                const { data } = await getVideoDetails(history.slice(0, 15).join());
                setVids(data.items);
                setIsLoading(false);
            } catch(error) {
                const message = error?.response?.data?.error?.message || error;
                console.log(message);
            }
        };
        async();
    }, []);

    useSetTitle('history', '', [], setLayout);

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
                <LoadingPlaceholder 
                        quantity={4}
                        placeholderType='CardVideo'
                        subType='horizontal' />
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
                    (<CardVideo 
                            video={video}
                            key={video.id+index}
                            layout="horizontal" />))}
            </div> 
        </CSSTransition >
    </div>
  )
}

export default History



