import { useState, useEffect } from "react";

export const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        windowWidth: undefined,
        windowHeight: undefined,
    });

    useEffect(() => {
        function resizeHandler() {
            setWindowSize({
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
            });
        }

        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    return windowSize;
}; 