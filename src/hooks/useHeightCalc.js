import { useEffect } from 'react';

import textHeightCalc from '../utils/textHeightCalc';

const useHeightCalc = ({ textNode, setDescDivider, description, type, dependencies, fontSize = 16 }) => {
  
    return (
        useEffect(() => {
            const width = document.documentElement.clientWidth + 13;
            let widthAmend = 0;
            let fntSize = fontSize;
            let lines;

            if (typeof(type) === 'number') {
                lines = type;
                fntSize = (width > 768) ? 20 : 16;
            } else if (type === 'horizontal') {
                lines = 5;
                widthAmend = (width > 768) ? 0 : 2;
            } else {
                lines = 3;
            }
            
            const textWidth = textNode.current?.offsetWidth;
            setDescDivider(textHeightCalc(description, (lines - widthAmend), textWidth, fntSize));
        }, [...dependencies])
    )
};

export default useHeightCalc