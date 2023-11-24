import React, { useState } from 'react'
import { moreOptionsIcon, profileIcon, savedIcon, settingsIcon, switchAccountIcon } from './SvgIcons'
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { ClickAwayListener, Menu } from '@mui/material';
import { MenuItem } from '@mui/base';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/userAction';
function MoreOptions() {
    const user = useSelector((state)=>state.user.user);
    const [expandMenu,setExpandMenu] = useState(false);
    const dispatch = useDispatch();
    const handleLogout=()=>{
        logoutUser(dispatch);
    }
    const menuItems = [
        {
            title: "Profile",
            icon: profileIcon,
            redirect: `/${user.username}`
        },
        {
            title: "Saved",
            icon: savedIcon,
            redirect: `/${user.username}`
        },
        {
            title: "Settings",
            icon: settingsIcon,
            redirect: "/accounts/edit"
        },
        {
            title: "Switch Account",
            icon: switchAccountIcon,
            redirect: "/"
        },
    ]
  return (
    <div className="relative">
        <MenuIcon className="cursor-pointer" onClick={()=>setExpandMenu(!expandMenu)}/>
        {expandMenu&&
        <ClickAwayListener onClickAway={()=>setExpandMenu(false)}>
        <div className="w-60 rounded-lg p-2 bg-white absolute right-0"
        style={{boxShadow:"0 0 10px 5px lightgray"}}>
        {menuItems.map((e,i)=>
            <Link to={e.redirect}>
            <div className="cursor-pointer flex items-center justify-start hover:bg-gray-200 rounded-lg p-3 space-x-2">
                <div>{e.icon}</div>
                <div>{e.title}</div>
            </div>
            </Link>
        )}
        <div className='hover:bg-gray-200 rounded-lg p-3 text-left cursor-pointer'
        onClick={handleLogout}
        >Log out</div>
        </div>
        </ClickAwayListener>
        }
    </div>
  )
}

export default MoreOptions