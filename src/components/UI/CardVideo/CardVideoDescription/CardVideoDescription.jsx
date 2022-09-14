import React, { memo, useContext, useRef, useState } from 'react';
import { WindowSizeContext } from '../../../../contexts/WindowSizeContext';
import useHeightCalc from '../../../../hooks/useHeightCalc';

const CardVideoDescription = ({ layout, description }) => {

    const [descDivider, setDescDivider] = useState(description.length);
    const { windowWidth } = useContext(WindowSizeContext);
    const textNode = useRef();

    useHeightCalc({
        textNode, 
        setDescDivider, 
        description, 
        type: layout, 
        dependencies: [windowWidth, description]
    });

    return (
        <div 
            ref={textNode}
            className={'video-card_'+layout+'_description_text'}>
            {description ? description.slice(0, descDivider) : "No words, no thoughts..."}
            
            {(description?.length > descDivider) &&
            <details>
                <summary></summary>
                {description?.slice(descDivider)}
            </details>}  
        </div> 
    )
};

export default memo(CardVideoDescription)