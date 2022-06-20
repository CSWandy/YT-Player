import { useEffect, useState } from "react";


export default function useRequest(request){
    
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        request()
        .then(res => setData(res.data))
        .catch(err => setError(err))
        .finally(() => {setIsLoading(false); console.log(data);});

        return [data, error, isLoading]
    }, []);
} 