import Channel from "./Channel/Channel";
import ErrorBoundary from "../Boundaries/ErrorBoundary/ErrorBoundary";
import MainBoundary from '../Boundaries/MainBoundary/MainBoundary';
import Subscriptions from './Subscriptions/Subscriptions';
import Liked from './Liked/Liked';
import History  from './History/History';
import Search  from './Search/Search';
import Watch  from './Watch/Watch';
import PlaylistSaved  from './PlaylistSaved/PlaylistSaved';
import Playlist  from './Playlist/Playlist';
import Privacy from './Privacy/Privacy';

const routesExport = {
    Channel,
    ErrorBoundary,
    MainBoundary, 
    Subscriptions,
    Liked,
    History,
    Search,
    Watch,
    PlaylistSaved,
    Playlist,
    Privacy
};

export default routesExport