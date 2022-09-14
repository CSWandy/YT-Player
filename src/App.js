import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import routesExport from './components/Routes/routesExport';

function App() {

const {
    Channel,
    MainBoundary,  
    Subscriptions, 
    Liked, 
    History, 
    Search, 
    Watch, 
    PlaylistSaved, 
    Playlist, 
    Privacy
} = routesExport;

    return (
        <Routes>
            <Route index element={<Navigate to="/playlist" replace/>} />
            <Route path="*" element={<Navigate to="/playlist" replace/>} />
            <Route path="/" element={<MainBoundary/>}>
                <Route path="subscriptions" element={ <Subscriptions/>} />
                <Route path="liked" element={ <Liked/>} />
                <Route path="history" element={ <History/>} />
                <Route path='watch/:vidId' element={<Watch/>} /> 
                <Route path='search/:query' element={<Search/>} /> 
                <Route path='channel/:channelId' element={<Channel/>} /> 
                <Route path='playlist/' element={<Outlet/>} >
                    <Route index element={<PlaylistSaved/>} />
                    <Route path=':playlistId' element={<Playlist/>} /> 
                </Route> 
                <Route path='privacy' element={<Privacy/>} /> 
            </Route>
        </Routes>
    )
}

export default App
