function calculateLines(text, lineGoal, nodeWidth, fontSize) {
    
    if (text === undefined || text.length === 0) {
        return 0
    }

    let lines = 1;
    let lastLineIndex = text.length;
  
    // GOST_A font constants:
    // ref https://bl.ocks.org/tophtucker/62f93a4658387bb61e4510c37e2e97cf
    const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1859375,0.246875,0.3453125,0.6625,0.540625,0.93125,0.6375,0.246875,0.3,0.3,0.440625,0.5,0.246875,0.5,0.3,0.6375,0.540625,0.4,0.540625,0.5,0.540625,0.5,0.540625,0.540625,0.540625,0.540625,0.24375,0.3203125,0.5,0.5,0.5,0.515625,0.9,0.5,0.540625,0.5,0.540625,0.5,0.5,0.540625,0.540625,0.246875,0.4421875,0.540625,0.4421875,0.6375,0.540625,0.540625,0.540625,0.6,0.540625,0.540625,0.540625,0.540625,0.6,0.8,0.6,0.6,0.540625,0.3,0.6375,0.3,0.4421875,0.6,0.334375,0.5,0.5,0.5,0.5,0.5,0.4,0.5,0.5,0.246875,0.3,0.5,0.3453125,0.6375,0.5,0.5,0.5,0.5,0.4421875,0.5,0.4,0.5,0.5,0.7,0.5,0.5,0.5,0.325,0.2453125,0.325,0.540625]
    const avg = 0.4863651315789473;
    const correction = 1.187;

    // find line breaks and whitespace indecies
    const lineBreaks = [...text.matchAll(/\r\s|\n\s|\r|\n/igm)].map(a => a.index);
    const whiteSpaces = [...text.matchAll(/\s/igm)].map(a => a.index);

    // calculate height, update last line index
    // acc[0] for last line length, acc [1] for last word length
    text.split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((acc, cur, index, array) => {
        // check if lines goal achieved
        if (lines === lineGoal) {
            lastLineIndex = index;
            array.splice(0);                 // finish iteration
        }
        // null acc if line break found
        if(lineBreaks.includes(index)) {
            lines ++;
            acc = [0, 0];
        }
        // null last word if space found
        if(whiteSpaces.includes(index)) {
            acc[1] = 0;
        }
        // increment line number and move last word to new line if line width increase textNode width 
        if((acc[0] + cur) * fontSize  > nodeWidth * correction) {
            lines ++;
            acc[0] = acc[1];
        }
        return [acc[0] + cur, acc[1] + cur]
    }, [0, 0]); 
    if (lastLineIndex === text.length){
        return lastLineIndex 
    }

    // find whitespace before last index
    const lastSpaceIndex = Math.max.apply(Math, whiteSpaces.filter(item => (item <= lastLineIndex)));
    
    return lastSpaceIndex + 1 
  }

  export default  calculateLines