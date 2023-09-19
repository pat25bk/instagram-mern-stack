import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ChatListItem({chatInfo,isOnline}) {
    const {_id, users, latestMessage} = chatInfo;
    const localUser = useSelector((state)=>state.user.user);
    const remoteUser = users.find((u)=>u._id!==localUser._id);
    return (
        <Link to={`/direct/t/${_id}`}>
        <div className="h-[72px] border-b py-2 px-6 hover:bg-gray-100">
            <div className="flex flex-row">
                <div className="w-[56px] h-[56px]">
                    <img className="rounded-full object-cover" src={remoteUser.avatar} alt="avatar" />
                    {isOnline&&<div className='w-3 h-3 rounded-full bg-green-500 relative'></div>}
                </div>
                <div className="pl-3 text-left">
                    <div className="text-md mb-2">{remoteUser.name}</div>
                    <div className="text-xs text-gray-500">{latestMessage?latestMessage.content:""}</div>
                </div>
            </div>
        </div>
        </Link>
        
    )
}

export default ChatListItem;