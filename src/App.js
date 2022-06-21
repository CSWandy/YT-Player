import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Layout from './components/Routes/Layout/Layout';
import Subscriptions from './components/Routes/Subscriptions/Subscriptions';
import Liked from './components/Routes/Liked/Liked';
import History  from './components/Routes/History/History';
import Search  from './components/Routes/Search/Search';
import Watch  from './components/Routes/Watch/Watch';
import Playlists  from './components/Routes/Playlists/Playlists';
import Playlist  from './components/Routes/Playlist/Playlist';
import Channel from './components/Routes/Channel/Channel';
import Privacy from './components/Routes/Privacy/Privacy';

function App() {

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
