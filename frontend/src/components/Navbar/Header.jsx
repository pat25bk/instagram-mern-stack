import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import sampleAvatar from "./logo192.png"
import { exploreFill, exploreOutline, homeFill, homeOutline, likeFill, likeOutline, messageFill, messageOutline, postUploadOutline, searchIcon, searchLargeIcon } from './SvgIcons'
import { useSelector } from 'react-redux'
import { ClickAwayListener, Tooltip } from '@mui/material'
import SearchModal from './SearchModal'
import SearchBox from './SearchBar/SearchBox'
import NewPostModal from './NewPostModal'
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants'
import MoreOptions from './MoreOptions'
import SideModal from './SideModal'
import NotifyModal from './NotifyModal'

function Header() {
    const [profileToggle, setProfileToggle] = useState(false);
    const [onHome, setOnHome] = useState(false);
    const [onChat, setOnChat] = useState(false);
    const [onExplore, setOnExplore] = useState(false);
    const location = useLocation();
    const self = useSelector((state) => state.user.user);
    const [showSearch,setShowSearch] = useState(false);
    const [showNewPost,setShowNewPost] = useState(false);
    const [showNotify,setShowNotify] = useState(false);
    const navigate = useNavigate();
    let customAvatar="";

    useEffect(()=>{
        setOnHome(location.pathname==="/");
        setOnChat(location.pathname.split("/").includes("direct"));
    },[location])

    const handleSearchClose = (username)=>{
        console.log("handleSearchClose called")
        setShowSearch(false);
        navigate(`/${username}`);
    }
    
    // if(profileToggle||(!onHome&&!onChat)){
    if(profileToggle){
        customAvatar = "border-2 border-black";
    }
    
    const handleClickOnSearch=()=>{
        setShowNotify(false);
        setShowSearch(!showSearch)
    }

    const handleClickOnNotify=()=>{
        setShowSearch(false);
        setShowNotify(!showNotify);
    }
    const handleClickAway=()=>{
        setShowSearch(false);
        setShowNotify(false);
    }
    
    const menuItemStyle='p-2 rounded-lg hover:bg-gray-200 transform hover:scale-110';

    return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <nav className="fixed w-full bg-white top-0 border-b z-10">
    <NotifyModal open={showNotify} onClose={()=>setShowNotify(false)}/>
    <SearchModal open={showSearch} onClose={handleSearchClose}/>
    <NewPostModal open={showNewPost} onClose={()=>setShowNewPost(false)}/>
    <div className="flex flex-row justify-between items-center py-2 px-3.5 sm:w-full sm:py-2 sm:px-4 md:w-full md:py-2 md:px-6 xl:w-4/6 xl:py-3 xl:px-8 mx-auto">
        <Link path="/"><img className="" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"/></Link>
        <SearchBox/>
        {/* Menu Items */}
        <div className="flex justify-between items-center space-x-6">
            <Link to="/">
            <div className={menuItemStyle}>
            {(profileToggle || !onHome)?homeOutline:homeFill}
            </div>
            </Link>
           
            <Link to="/direct/inbox" onClick={()=>setOnChat(!onChat)}>
            <div className={menuItemStyle}>
            {onChat?messageFill:messageOutline}
            </div>
            </Link>
            
            <Link to="/explore">
            <div className={menuItemStyle}>
            {onExplore?exploreFill:exploreOutline}
            </div>
            </Link>
            
            <div className={"hidden sm:block cursor-pointer "+menuItemStyle} onClick={handleClickOnSearch}>{searchLargeIcon}</div>

            <div className={"hidden sm:block cursor-pointer "+menuItemStyle} onClick={handleClickOnNotify}>{likeOutline}</div>

            <div onClick={()=>setShowNewPost(true)} className={"hidden sm:block cursor-pointer "+menuItemStyle}>{postUploadOutline}</div>
            
            <Link to={`/${self.username}`}>
            <div className={menuItemStyle}>
            <div onClick={()=>setProfileToggle(!profileToggle)}
            className={customAvatar+" w-7 h-7 rounded-full cursor-pointer p-[0.5px]"}>
            <img className="h-full w-full rounded-full object-cover" src={BASE_PROFILE_IMAGE_URL+self.avatar} alt="avatar"/>
            </div>
            </div>
            </Link>

            <MoreOptions/>
        </div>
    </div>
    </nav>
    </ClickAwayListener>
    )
}

export default Header