import { useEffect } from 'react';
import calculateLines from './textHeightCalc';

const useHeightCalc = (textNode, setDescDivider, description, type, dependencies, fSize = 16) => {
  
    return (
        useEffect(() => {
            const width = document.documentElement.clientWidth + 13;
            console.log(width);
            let widthAmend;
            let fontSize = fSize;
            let lines;

            if (typeof(type) === 'number') {
                lines = type;
                fontSize =  width > 768 ? 20 : 16;
                widthAmend = 0;
            } else {
                if (type === 'horizontal') {
                    lines = 5;
                    widthAmend = width > 768 ? 0 : 2;
                } else {
                    lines = 3;
                    widthAmend = 0;
                }
            }

            setTimeout(() => {
                const textWidth = textNode.current?.offsetWidth;
                setDescDivider(calculateLines(description, (lines - widthAmend), textWidth, fontSize));
                console.log(description.slice(0, 10), calculateLines(description, (lines - widthAmend), textWidth, fontSize));
            }, 1300); 
        }, [...dependencies])
    )
}

export default useHeightCalc