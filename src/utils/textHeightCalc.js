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
    const correction = 1.18;

    // find line breaks
    const lineBreakIndecies = [...text.matchAll(/\r\s|\n\s|\n|\r/igm)].map(a => a.index);

    // calculate height, update last line index
    text.split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((acc, cur, index, array) => {
        if (lines === lineGoal) {
            lastLineIndex = index;
            array.splice(1);                // finish iteration
        }
        if((acc + cur) * fontSize / correction > nodeWidth || lineBreakIndecies.includes(index)) {
            lines ++;
            acc = cur;
        }
        return acc + cur;
    }); 
    if (lastLineIndex === text.length){
        return lastLineIndex
    }

    // find preceding whitespace
    const lastSpaceIndex = Math.max.apply(Math, [...text.slice(0, lastLineIndex).matchAll(/\s|\r|\n/igm)].map(a => a.index));
    
    return lastSpaceIndex + 1 
  }

  export default  calculateLines