import { useEffect } from 'react';

const useFirstVisitInit = () => 
    useEffect(() => {
        if (localStorage.getItem('firstVisit') !== 'false') {
            localStorage.setItem('history', JSON.stringify(['dQw4w9WgXcQ']));
            localStorage.setItem('savedPlaylists', JSON.stringify(['PLTMN6OMDTnKmPEshAkltDlfJYLft6taZO', 'PLUcXHQ7VorrUQ4VcKSRo598i_8AhQplL_', 'PLU_aM5EzmeKRZkbmPi7d4-Nz55GxwAHIJ']));
            localStorage.setItem('token', '');
            localStorage.setItem('firstVisit', 'false');
            window.location.reload();
        }
    }, []);

export default useFirstVisitInit