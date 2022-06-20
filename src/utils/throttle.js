const throttle = (cb, interval=200) => {
    let nextTick;
    let lastRan;

    return function() {
        const args = arguments;
        if (!lastRan) {
            cb(...args);
            lastRan = Date.now();
        } else {
        clearTimeout(nextTick);
        nextTick = setTimeout(function() {
            if ((Date.now() - lastRan) >= interval) {
                cb(...args);
                lastRan = Date.now();
            }}, interval - (Date.now() - lastRan));
        }
    };
};

export default throttle