import Home from './components/Home/Home';
import {Routes,Route} from "react-router-dom"
import React from 'react';
import Header from './components/Navbar/Header';
import Inbox from './components/Chats/Inbox';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Auth/Login';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import Signup from './components/Auth/Signup';

function App() {
  const user = useSelector((state)=>state.user);
  console.log(user);
  return (
    <div className="App w-[100vw] h-[100vh]">
    {user.isAuthenticated&&<Header/>}
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/:username" element={<PrivateRoute><Profile/></PrivateRoute>}/>
      <Route path="/accounts/edit" element={<PrivateRoute><EditProfile/></PrivateRoute>}/>
      <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
      <Route path="/direct/inbox" element={<PrivateRoute><Inbox/></PrivateRoute>}/>
      <Route path="/direct/t/:chatId" element={<PrivateRoute><Inbox/></PrivateRoute>}/>
    </Routes>
    </div>
  );
}

export default App;
