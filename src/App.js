import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import AppRoutes from './components/Routes/';

function App() {

const {
    Channel,
    Layout,  
    Subscriptions, 
    Liked, 
    History, 
    Search, 
    Watch, 
    Playlists, 
    Playlist, 
    Privacy
} = AppRoutes;

    return (
        <Routes>
        <Route index element={<Navigate to="/playlist" replace/>} />
        <Route path="*" element={<Navigate to="/playlist" replace/>} />
        <Route path="/" element={<Layout/>}>
            <Route path="subscriptions" element={ <Subscriptions/>} />
            <Route path="liked" element={ <Liked/>} />
            <Route path="history" element={ <History/>} />
            <Route path='watch/:vidId' element={<Watch/>} /> 
            <Route path='search/:query' element={<Search/>} /> 
            <Route path='channel/:channelId' element={<Channel/>} /> 
            <Route path='playlist/' element={<Outlet/>} >
                <Route index element={<Playlists/>} />
                <Route path=':playlistId' element={<Playlist/>} /> 
            </Route> 
            <Route path='privacy' element={<Privacy/>} /> 
        </Route>
        </Routes>
    )
}

export default App
