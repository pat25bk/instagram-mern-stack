import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosInit';
import sampleAvatar from "../Navbar/logo192.png"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllChats } from '../../actions/chatAction';
import {Skeleton} from "@mui/material";
import {toast} from "react-toastify";
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants';
// import Dialog from '@mui/material/Dialog';

function SearchModal({open,onClose}) {

    const [searchTerm, setSearchTerm] = useState("");
    const [foundUsers, setFoundUsers] = useState(null);
    const [loading,setLoading]        = useState(false);
    const self = useSelector((state) => state.user.user);
    const chats = useSelector(state => state.allChats.chats);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchUsers = async(keyword)=>{
        setLoading(true);
        try{
            const res = await axiosInstance.get(`/api/user/users/?keyword=${keyword}`);
            const tmp = res.data.filter((u)=>u._id !== self._id);
            setFoundUsers(tmp);
        }catch(error){
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(()=>{
        console.log(`searching with ${searchTerm.trim()}`);
        if(searchTerm.trim()!==""){
            console.log(`searching with ${searchTerm.trim()}`);
            fetchUsers(searchTerm.trim());
        }
    },[searchTerm]);

    const handleInsideClick=(e)=>{
        e.stopPropagation();
    }

    const handleNewChat= async(userId)=>{
        //Check if current user already a chat this selected user
        const existChat = chats.find((chat)=>chat.users.some((u)=>u._id===userId));
        if(existChat){
            navigate("/direct/t/"+existChat._id);
            onClose();
        }else
        {
            try{
                //Send request creating new chat to server
                const res = await axiosInstance.post("/api/chat/newChat",{receiverUserId:userId});
                //Update all chat list at redux store
                getAllChats(dispatch);
                //Close Modal
                onClose();
                //Clear search
                setSearchTerm("");
                //Clear search result
                setFoundUsers(null);
                //Re-Direct to new chat route
                navigate("/direct/t/"+res.data.newChat._id);
            }catch(err){
                toast.error(err);
            }
        }
    }
  return (
    open&&<div className='w-screen h-screen bg-black bg-opacity-70 fixed  z-10 top-0 left-0 flex justify-center items-center'
    onClick={onClose}>

        <div className="w-[45%] h-[65%] bg-white rounded-xl py-3 flex flex-col space-y-2"
        onClick={handleInsideClick}>

        <div className="flex justify-between">
        <p></p>
        <p><strong>New message</strong></p>
        <p className='text-xl font-bold pr-3 cursor-pointer' onClick={onClose}>✕</p>
        </div>

        <div className="flex border-t border-b border-gray-200 px-3 py-2">
            <label className="mr-4"><strong>To :</strong></label>
            <input className="flex-1 text-sm outline-none focus:outline-none" 
            type="text" 
            placeholder='Search...'
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            />
        </div>

         {/* Search result */}

        <div style={{flex:"5"}} className="overflow-y-scroll">
        {
            loading?
            Array(8).fill("").map((e,i)=>(
                <div key={i} className="flex flex-row item-center cursor-pointer py-2 pl-3">
                <div className="flex items-center justify-center">
                <Skeleton variant="circular" width={40} height={40}/>
                </div>
                   
                    <div className="flex flex-col justify-center pl-4 w-full gap-0">
                        <Skeleton width="45%" sx={{ fontSize: '1rem' }}/>
                        <Skeleton width="30%" sx={{ fontSize: '1rem' }}/>
                    </div>
                </div>
            ))
            :
            foundUsers?
            foundUsers.map((u)=>
                <div key={u._id} className="flex flex-row cursor-pointer hover:bg-gray-200 py-2 pl-3" 
                onClick={()=>handleNewChat(u._id)}>
                <div className="w-[40px] h-[40px]">
                    <img className="rounded-full object-cover border border-gray-200" src={BASE_PROFILE_IMAGE_URL+u.avatar} alt="avatar" />
                </div>
                <div className="pl-3 text-left">
                    <div className="text-sm">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.username}</div>
                </div>
                </div>
            )
            :<div className="text-gray-400 text-left text-sm pl-3 pt-3">No account found</div>
        }
        </div>
        <div className="px-3">
        <button className="bg-primary-blue p-2.5 w-full rounded-lg opacity-50 text-white">Chat</button>

        </div>
        
        </div>
    </div>
  )
}

export default SearchModal