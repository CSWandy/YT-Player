import { useCallback, useState } from "react";

const useBoundaryThrowError = () => {
    const [error, setError] = useState();

    return useCallback ( error => {
        setError(() => {
            throw error;
        });
    }, [setError]);
  };

  export default useBoundaryThrowError;