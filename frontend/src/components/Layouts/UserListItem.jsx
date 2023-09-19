import React from 'react'
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

function UserListItem({_id,avatar,username,name,isPageOfLogginUser}) {
    const loginUser = useSelector((state)=>state.user.user);
    const isFollowing = loginUser.following.includes(_id);
    const handleFollow=()=>{};
    const handleUnfollow=()=>{};
    return(
        <div className="flex items-center justify-between py-2 px-4 text-sm">
        <div className="flex space-x-3 items-center">
            <img className="w-11 h-11 rounded-full object-cover" src={BASE_PROFILE_IMAGE_URL + avatar} alt="avatar" />
            <div className="flex flex-col items-start">
            <Link to={`/${username}`}>
                <span className="text-black text-sm font-semibold cursor-pointer">{username}</span>
            </Link>
                <span className="text-gray-400 text-sm">{name}</span>
            </div>
        </div>
        <div>
        {isFollowing?
            <button 
            className="rounded-lg py-2 px-4 bg-gray-200 hover:bg-gray-300"
            onClick={handleUnfollow}>Unfollow</button>
            :
            <button 
            className="rounded-lg py-1.5 px-4 text-white font-semibold bg-primary-blue hover:bg-blue-500"
            onClick={handleFollow}>Follow</button>
        }
        </div>
    </div>
    )
}

export default UserListItem