import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import sampleAvatar from "./logo192.png"
import { exploreFill, exploreOutline, homeFill, homeOutline, likeFill, likeOutline, messageFill, messageOutline, postUploadOutline, searchIcon, searchLargeIcon } from './SvgIcons'
import { useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'
import SearchModal from '../Chats/SearchModal'
import SearchBox from './SearchBar/SearchBox'
import NewPostModal from './NewPostModal'

function Header() {
    const [profileToggle, setProfileToggle] = useState(false);
    const [onHome, setOnHome] = useState(false);
    const [onChat, setOnChat] = useState(false);
    const [onExplore, setOnExplore] = useState(false);
    const location = useLocation();
    const self = useSelector((state) => state.user.user);
    const [showSearch,SetShowSearch] = useState(false);
    const [showNewPost,setShowNewPost] = useState(false);

    const navigate = useNavigate();
    let customAvatar="";

    useEffect(()=>{
        setOnHome(location.pathname==="/");
        setOnChat(location.pathname.split("/").includes("direct"));
    },[location])

    const handleSearchClose = (username)=>{
        navigate(`/${username}`);
    }
    
    // if(profileToggle||(!onHome&&!onChat)){
    if(profileToggle){
        customAvatar = "border-2 border-black";
    }
    // console.log(customAvatar);

    return (
    <nav className="fixed w-full bg-white top-0 border-b z-10">
    <SearchModal open={showSearch} onClose={handleSearchClose}/>
    <NewPostModal open={showNewPost} onClose={()=>setShowNewPost(false)}/>
    <div className="flex flex-row justify-between items-center py-2 px-3.5 sm:w-full sm:py-2 sm:px-4 md:w-full md:py-2 md:px-6 xl:w-4/6 xl:py-3 xl:px-8 mx-auto">
        <Link path="/"><img className="" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"/></Link>
        <SearchBox/>
        {/* Menu Items */}
        <div className="flex justify-between items-center space-x-6">
            <Link to="/">{(profileToggle || !onHome)?homeOutline:homeFill}</Link>

            <Link to="/direct/inbox" onClick={()=>setOnChat(!onChat)}>{onChat?messageFill:messageOutline}</Link>

            <Link to="/explore">{onExplore?exploreFill:exploreOutline}</Link>

            <span className="hidden sm:block cursor-pointer" onClick={()=>{SetShowSearch(!showSearch)}}>{searchLargeIcon}</span>

            <span className="hidden sm:block cursor-pointer">{likeOutline}</span>

            <span onClick={()=>setShowNewPost(true)} className="hidden sm:block cursor-pointer">{postUploadOutline}</span>
            
            <Link to={`/${self.username}`}>
            
            <div onClick={()=>setProfileToggle(!profileToggle)}
            className={customAvatar+" w-7 h-7 rounded-full cursor-pointer p-[0.5px]"}>

            <img className="h-full w-full rounded-full object-cover" src={sampleAvatar} alt="avatar"/>
            
            </div>
            </Link>
        </div>
    </div>
    </nav>
    )
}

export default Header