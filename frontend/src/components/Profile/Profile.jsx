import React, { useEffect, useState } from 'react'
import { chatIcon, commentFillIcon, likeFill, likeFillWhite, messageFill, postsIcon, reelsIcon, settingsIcon, taggedIcon } from '../Navbar/SvgIcons'
import InfiniteScroll from "react-infinite-scroll-component";
import SpinLoader from '../Layouts/SpinLoader';
import { CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosInit';
import { fetchUserDetails, reloadUser } from '../../actions/userAction';
import SEO from '../SEO/SEO';
import BackdropLoader from '../Layouts/BackdropLoader';
import Dialog from '@mui/material';
import {toast} from "react-toastify";
import { ToastContainer } from 'react-toastify';
import { USER_DETAILS_CLEAR_ERROR } from '../../reducers/userReducers';
import UsersModal from './UsersModal';
import { BASE_POST_IMAGE_URL } from '../../utils/constants';


function Profile() {
    const posts = Array(9).fill("");
    const [subRoute, setSubroute] = useState("posts");
    const params = useParams();
    const currentUsername = params.username;
    const loginUser = useSelector((state)=>state.user.user);
 
    const [followStatus,setFollowStatus] = useState(false);
    const [savedTab,setSavedTab] = useState(null);
    const {error,user,loading} = useSelector((state)=>(state.userDetails));
    const dispatch = useDispatch();
    const [showFollowing,setShowFollowing] = useState(false);
    const [showFollowers,setShowFollowers] = useState(false);
    const navigate = useNavigate();

    // console.log(user);
    const infoList = [
        'Meta',
        'About',
        'Blog',
        'Jobs',
        'Help',
        'API',
        'Privacy',
        'Terms',
        'Locations',
        'Instagram Lite',
        'Threads',
        'Contact Uploading & Non-Users',
        'Meta Verified',
        'English'
    ];

    //   const selectedStyle = 
    const nPost = "100";
    const nFollower = "20K";
    const nFollowing = "200";
    const bio = `fsdf 
    f sf 
    dsfsdf`;

    const CatItem = ({ name, title, icon }) => {
        return <div
            onClick={() => setSubroute(name)}
            className={`py-4 cursor-pointer flex items-center space-x-2
    ${subRoute === name ? "opacity-100 border-t border-black" : "opacity-50"}`}>
            {icon} <span>{title}</span>
        </div>
    }

    useEffect(()=>{
        setFollowStatus(false);
    },[currentUsername]);

    useEffect(()=>{
        if(user){
            console.log(user.followers,loginUser._id);
            // if(user.followers.some((u)=>u._id===loginUser._id)){
            if(loginUser.following.includes(user._id)){
                setFollowStatus(true);
            }else{
                setFollowStatus(false);
            }
        }
    },[user,loginUser]);

    useEffect(()=>{
        fetchUserDetails(dispatch,currentUsername);
    },[currentUsername,dispatch]);

    useEffect(()=>{
        if(error){
        toast.error(error);
        dispatch(USER_DETAILS_CLEAR_ERROR());
        }
    },[error,dispatch]);

    const [postList, setPostList] = useState(Array(10).fill(""))

    const fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {
            setPostList([...postList, ...Array(9).fill("")]);
        }, 1500);
    };

    const handleFollow=async(e)=>{
        console.log(e.target.name);
        let res = {};
        try{
            if(e.target.name==="followBtn"){
                res = await axiosInstance.post(`/api/user/follow/${user._id}`);
            }else{
                res = await axiosInstance.post(`/api/user/unfollow/${user._id}`);
            }
            setFollowStatus(true);
            toast.success(res.data);
            reloadUser(dispatch);
        }catch(err){
            toast.error(err)
        }
    }
    
    const handleSendMessage=async()=>{
        //Send request to create new chat object if there not
        //Navigate to chat route
        try{
            const res = await axiosInstance.post("/api/chat/newChat",{receiverUserId:user._id});
            navigate("/direct/t/"+res.data.newChat._id);
        }catch(err){
            console.log(err);
            toast.error(err);
        }
    }

    console.log("followStatus:",followStatus)


    return (
        <>
        <SEO title={`${user?.name} (@${user?.username}) • Instagram photos and videos`}/>
        {loading&&BackdropLoader}
        <ToastContainer theme="colored"/>

        {user?
        <div className="flex justify-center mt-14">
            {/* <CircularProgress color="inherit" /> */}
            <div className="w-full lg:w-[75%]">
                <div className="flex justify-center items-start border-b border-gray-200 py-5">
                    <div>
                        <img className="w-[150px] h-[150px] bg-gray-300 rounded-full" src="" alt="avatar" />
                    </div>
                    <div className='flex flex-col items-left ml-20 space-y-5'>
                        {currentUsername===loginUser.username?
                            <div className="flex items-center space-x-2">
                            <span className="text-lg">{currentUsername}</span>
                            <button className="bg-gray-200 font-semibold text-sm py-1.5 px-4 rounded-lg hover:bg-gray-300">Edit profile</button>
                            <button className="bg-gray-200 font-semibold text-sm py-1.5 px-4 rounded-lg  hover:bg-gray-300">View Archive</button>
                            <span>{settingsIcon}</span>
                        </div>
                        :
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">{currentUsername}</span>
                            {followStatus?
                            <button onClick={handleFollow} name="unfollowBtn" className="bg-gray-200 font-semibold text-sm py-1.5 px-4 rounded-lg hover:bg-gray-300">Unfollow</button>
                            :
                            <button onClick={handleFollow} name="followBtn" className="font-semibold text-sm py-1.5 px-4 rounded-lg bg-primary-blue hover:bg-blue-500 text-white">Follow</button>
                            }
                            <button 
                            className="bg-gray-200 font-semibold text-sm py-1.5 px-4 rounded-lg  hover:bg-gray-300"
                            onClick={handleSendMessage}
                            >Message</button>
                            <span>{settingsIcon}</span>
                        </div>
                        }
                        <div className="flex text-left space-x-10">
                            <div className="cursor-pointer">
                                <span className="font-semibold text-lg">{user.posts.length}</span> post
                            </div>
                            <div className="cursor-pointer" onClick={()=>setShowFollowers(true)} >
                                <span className="font-semibold text-lg">{user.followers.length}</span> follower
                            </div>
                            <div className="cursor-pointer" onClick={()=>setShowFollowing(true)}>
                                <span className="font-semibold text-lg">{user.following.length}</span> following
                            </div>
                        </div>
                        <div className="text-left">
                        <p>{user.name}</p>
                        <pre>
                        {user.bio}
                        </pre>
                        </div>
                    </div>
                </div>

                <UsersModal 
                open={showFollowing} 
                onClose={()=>setShowFollowing(false)} 
                modalTitle="Following" 
                userList={user.following}/>

                <UsersModal
                    open={showFollowers} 
                    onClose={()=>setShowFollowers(false)} 
                    modalTitle="Followers"
                    userList={user.followers}
                />

                <div className="border-t border-gray-300 mt-5">
                    <div className="flex justify-center space-x-14 text-[12px] font-semibold">
                        <CatItem name="posts" title="POSTS" icon={postsIcon} />
                        <CatItem name="reels" title="REELS" icon={reelsIcon} />
                        <CatItem name="tagged" title="TAGGED" icon={taggedIcon} />
                    </div>
                    {/* <div className="grid grid-cols-3 gap-1"> */}
                    <InfiniteScroll
                        dataLength={user.posts.length}
                        next={fetchMoreData}
                        hasMore={true}
                        loader={<div className="flex justify-center items-center"><SpinLoader /></div>}
                        className="grid grid-cols-3 gap-1">
                        {user.posts.map((p) => (
                            <div className="relative w-full aspect-square bg-yellow-500">
                                <img className="w-full h-full object-cover" src={BASE_POST_IMAGE_URL+p.image} alt="post"/>
                                <div className="absolute top-0 w-full h-full bg-black/25 opacity-0 hover:opacity-100
                                flex justify-center items-center space-x-8
                                font-bold text-white text-lg
                                ">
                                    <div className="flex space-x-2 items-center">
                                        {likeFillWhite}
                                        <span> 1000</span>
                                    </div>
                                    <div className="flex space-x-2 items-center ">
                                        {commentFillIcon}
                                        <span>20</span></div>
                                </div>
                            </div>
                        )
                        )}
                    </InfiniteScroll>
                    {/* </div> */}
                </div>

                <div className="hidden md:block pt-5 pb-16 space-y-4">
                    <div className="text-gray-500 text-xs flex flex-wrap justify-center space-x-4 cursor-pointer">
                        {infoList.map((e, i) => <span key={i}>{e}</span>)}
                    </div>
                    <div className='text-gray-500 text-xs flex flex-wrap justify-center space-x-2 cursor-pointer'>
                        <span>English</span>
                        <span>© 2023 Instagram from Meta</span>
                    </div>
                </div>
                <div>
                </div>

            </div>
        </div>:
        <div>Not Found</div>
        }
        </>
    )
}

export default Profile