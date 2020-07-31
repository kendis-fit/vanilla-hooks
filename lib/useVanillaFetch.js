import { useState, useEffect } from "react";

function useVanillaFetch(fetchMethod) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                setData(await fetchMethod());        
                setLoading(false);
            } catch (error) {
                setError(error);
            }
        }
        getData();
    }, [fetchMethod]);

    return { data, setData, error, loading };
}

export default useVanillaFetch;