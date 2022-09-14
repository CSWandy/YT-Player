import React, { memo, useContext, useRef, useState } from 'react';
import parse from 'html-react-parser';

import { WindowSizeContext } from '../../../../contexts/WindowSizeContext';

import useHeightCalc from '../../../../hooks/useHeightCalc';

const CardPlaylistDescription = ({ lines, description, title }) => {

    const [descDivider, setDescDivider] = useState(description.length);
    const { windowWidth } = useContext(WindowSizeContext);
    const textNode = useRef();

    useHeightCalc({
        textNode, 
        setDescDivider, 
        description, 
        type: lines, 
        dependencies: [windowWidth, description]
    });
    
    return (
        <div className='horizontal_thumbnail_description'>
            <h3 className='horizontal_thumbnail_description_title'>{parse(title)}</h3>
            <div className='horizontal_thumbnail_description_text'>
                <span ref={textNode}>
                    {description ? description?.slice(0, descDivider) : "No words, no thoughts..."}
                </span>
                {(description?.length > descDivider) &&
                <details>
                    <summary></summary>
                    {description?.slice(descDivider)}
                </details>}   
            </div>
        </div>
    )
};

export default memo(CardPlaylistDescription)