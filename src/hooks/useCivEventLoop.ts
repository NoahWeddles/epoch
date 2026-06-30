import { useEffect } from 'react';
import { runCivEvents } from '../lib/conquest';

export function useCivEventLoop() {
    useEffect(() => {
        const id = setInterval(runCivEvents, 1000);
        return () => clearInterval(id);
    }, []);
}
