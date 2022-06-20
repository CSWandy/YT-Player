import { useCallback, useRef } from 'react';

const useDebounce = (callBack, interval=200) => {
  
    const timer = useRef();

    const debouncedCallback = useCallback( () => {
        if (timer.current) {
            clearTimeout(timer);
        }

        timer.current = setTimeout(callBack, interval);
    }, [callBack, interval]);

    return debouncedCallback
}

export default useDebounce