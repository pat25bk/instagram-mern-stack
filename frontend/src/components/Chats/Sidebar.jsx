import React, { useEffect } from 'react'
import ChatListItem from './ChatListItem'
import sampleAvatar from "../Navbar/logo192.png"
import { newMessageIcon } from '../Navbar/SvgIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChats } from '../../actions/chatAction';

function Sidebar({onlineUsers,handleModalOpen}) {
    const user = useSelector(state=>state.user.user);
    const chats = useSelector(state=>state.allChats.chats);
    const dispatch = useDispatch();

    useEffect(()=>{
        getAllChats(dispatch);
    },[dispatch])

    // console.log(chats);
    console.log(onlineUsers);
    return (
        <div className="w-1/3 border-r">
            <div className="h-1/4 border-b">
                <div className="flex justify-between h-3/4 pt-10 px-5">
                    <span className="text-xl font-bold">{user.name}</span>
                    <span onClick={handleModalOpen}>{newMessageIcon}</span>
                </div>
                <div className="flex justify-between h-1/4 px-5">
                    <span><strong>Messages</strong></span>
                    <span>Requests</span>
                </div>
            </div>
            <div className="h-3/4 overflow-y-scroll">
                {chats&&chats.map((chat) =>{
                const friend = chat.users.find((u)=>u._id!==user._id);
                const isOnline = onlineUsers.some((u)=>u.userId===friend._id);
                return <ChatListItem chatInfo={chat} isOnline={isOnline} key={chat._id} />
                })}
            </div>
        </div>
    )
}

export default Sidebar