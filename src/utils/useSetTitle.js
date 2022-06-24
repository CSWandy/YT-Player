import { useEffect } from 'react';

const useSetTitle = (type, text, depenendies, setLayout = (() => {})) => {

    let template;

    switch(type) {
        case 'channel':
            template = `Channel - ${text ? text : ''}`;
            break
        case 'history':
            template = 'History';
            break
        case 'liked':
            template = 'Liked';
            break
        case 'playlist':
            template = `Playlist - ${text ? text : ''}`;
            break
        case 'playlists':
            template = 'Playlists';
            break
        case 'privacy':
            template = 'Privacy info';
            break
        case 'search':
            template = `Search - ${text ? text : ''}`; 
            break
        case 'subscriptions':
            template = `Subscriptions`; 
            break
        case 'watch':
            template = `Play - ${text ? text : ''}`; 
            break
        default:
            template = '';
            break
    }

  return useEffect( () => {
        setLayout(prev => ({...prev, menuActive: template})); 
        document.title = template;
    }, [...depenendies]);

}

export default useSetTitle