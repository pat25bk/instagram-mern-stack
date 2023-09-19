import React, { useState } from 'react'
import { Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';

function SideBar() {
  const [loading, setLoading] = useState(true);
  const loginUser = useSelector((state)=>state.user.user);

  const suggestedUsers = Array(5).fill("");
  return (
    // <div className="border border-red-700 fixed lg:right-32 xl:right-56 w-3/12 h-full hidden lg:flex flex-col flex-auto m-8 mt-12 pr-8 z-1">
    <div className="border border-red-700 sm:hide lg:w-1/3">

      <div className="flex items-center mb-3">
        <div><img className="w-11 h-11 rounded-full border border-gray-500" src={loginUser.avatar} alt="avatar" /></div>
        <div className="flex-1 text-left pl-4">
          <p className="text-sm font-semibold cursor-pointer">{loginUser.username}</p>
          <p className="text-xs text-gray-500">{loginUser.name}</p>
        </div>
        <div className="text-xs text-primary-blue font-semibold cursor-pointer"></div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-gray-500">Suggest for you</p>
        <p className="text-xs font-semibold cursor-pointer">See All</p>
      </div>
      {
        loading ?
          Array(5).fill("").map((e, i) =>
            <div className="flex items-center mb-3">
              <Skeleton variant="circular" width="44px" height="44px" animation="wave" />
              <div className="flex-1 text-left pl-4">
                <Skeleton width="50%" />
                <Skeleton width="30%" />
              </div>
              <div className="text-xs text-primary-blue font-semibold cursor-pointer">Follow</div>
            </div>
          )
          :
          suggestedUsers.map((e, i) =>
            <div className="flex items-center mb-3">
              <div><img className="w-11 h-11 rounded-full border border-gray-500" src="" alt="avatar" /></div>
              <div className="flex-1 text-left pl-4">
                <p className="text-sm font-semibold cursor-pointer">Username</p>
                <p className="text-xs text-gray-500">Info</p>
              </div>
              <div className="text-xs text-primary-blue font-semibold cursor-pointer">Follow</div>
            </div>
          )
      }
      <div className="text-gray-300 text-sm text-left">© 2023 INSTAGRAM FROM META</div>
    </div>
  )
}

export default SideBar