import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./dots.css"
import { commentIcon, saveFillIcon , likeFill, likeOutline, moreOptionsIcon, saveIcon, sharePostIcon, smallEmojiIcon, likeOutlineTiny } from '../Navbar/SvgIcons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import ScrollToBottom from "react-scroll-to-bottom";
import { BASE_POST_IMAGE_URL, BASE_PROFILE_IMAGE_URL } from '../../utils/constants';
import { Link } from 'react-router-dom';
import PostOptionsDialog from './PostOptionsDialog';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInit';
import { toast } from 'react-toastify';
import { ClickAwayListener } from '@mui/material';
import UsersModal from '../Profile/UsersModal';

function PostItem({_id, caption, likes, comments, image, postedBy, savedBy, createdAt}) {
    const [foldCaption,setFoldCaption]  = useState((caption.length>50)?true:false);
    const [allLikes,setAllLikes] = useState(likes);
    const [allComments,setAllComments] = useState(comments);
    const [allSavedBy, setAllSavedBy] = useState(savedBy);

    const [liked,setLiked] = useState(false);
    const [saved,setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [showEmoji,setShowEmoji] = useState(false);
    const [showMore,setShowMore] = useState(false);
    const [showPostOptions,setShowPostOptions] = useState(false);
    const [showSubmit,setShowSubmit] = useState(true);
    const [openLikeModal,setOpenLikeModal] = useState(false);

    const logginUser = useSelector((state)=>state.user.user);

    useEffect(()=>{
        if(likes.some((u)=>u._id=logginUser._id)){
            setLiked(true);
        }
    },[likes,logginUser]);
    
    useEffect(()=>{
        if(logginUser.saved.includes(_id)){
            setSaved(true);
        }
    },[savedBy,logginUser]);

    const handleLike=async()=>{
        try{
            if(liked){
                const res = await axiosInstance.post(`/api/post/${_id}/unlike`);
                setLiked(false);
                toast.success(res.data.message);
            }else{
                const res = await axiosInstance.post(`/api/post/${_id}/like`);
                setLiked(true);
                toast.success(res.data.message);
            }
            const res = await axiosInstance.get(`/api/post/${_id}`);
            setAllLikes(res.data.post.likes);
        }catch(err){
            toast.error(err);
        }
    }

    const handleSave=async()=>{
        try{
            if(saved){
                const res = await axiosInstance.post(`/api/user/unsave/${_id}`);
                setSaved(false);
                toast.success(res.data.message);
            }else{
                const res = await axiosInstance.post(`/api/user/save/${_id}`);
                setSaved(true);
                toast.success(res.data.message);
            }
        }catch(err){
            toast.error(err);
        }
    }

    const handlePostComment = async()=>{
        if(!comment){
            toast.error("Empty Comment!")
        }
        else{
        try{
            const res = await axiosInstance.post(`/api/post/${_id}/comment`,{comment:comment});
            toast.success(res.data.message);
            const resNewPost = await axiosInstance.get(`/api/post/${_id}`);
            setAllComments(resNewPost.data.post.comments);
            setComment("");
        }catch(err){
            toast.error(err.message);
        }
    }
    }

    var settings = {
        dots: true,
        appendDots: dots => (
            <div className="custom-dots">
              <ul>{dots}</ul>
            </div>
          ),
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        touchMove: true,
        responsive: [
            {
                breakpoint: 1050,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2
                }
            }
        ]
    };

    // console.log(allComments)
    // console.log(comment);
    // console.log("showEmoji:",showEmoji);
    console.log(allLikes);
    const handlePostOptionsClose=()=>{
        setShowPostOptions(false);
    }

    return (
        <div className="text-left text-sm space-y-2">
            <UsersModal 
            open={openLikeModal} 
            onClose={()=>setOpenLikeModal(false)}
            userList={allLikes}
            modalTitle="Likes"
            />
            {/* POST HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="rounded-full p-0.5 border-2 border-purple-500">
                    <img src={BASE_PROFILE_IMAGE_URL+postedBy.avatar} alt="avatar" className='rounded-full w-8 h-8 bg-gray-400 cursor-pointer object-cover' />
                    </div>
                    <Link to={`/${postedBy.username}`}>
                    <span className="text-sm ml-3 font-semibold cursor-pointer">{postedBy.username}</span>
                    </Link>
                    <span className="text-gray-400 ml-1">• {moment(createdAt).fromNow()}</span>
                </div>
                <div onClick={()=>setShowPostOptions(true)} className="cursor-pointer">{moreOptionsIcon}</div>
            </div>
            <PostOptionsDialog open={showPostOptions} onClose={handlePostOptionsClose}/>

            {/* POST IMAGE */}
            <Slider {...settings} className="">
                {/* {images.map((e, i) => */}
                    <div className="w-[468px] h-[585px] bg-yellow-400">
                    <img className="w-full h-full object-cover" src={BASE_POST_IMAGE_URL+image} alt="post"/>
                    </div>
                    {/* )} */}
            </Slider>

            {/* OPTIONS */}
            <div className="flex flex-row justify-between">
                <div className="flex justify-left space-x-3">
                    <div className="cursor-pointer hover:opacity-50" onClick={handleLike}>{liked?likeFill:likeOutline}</div>
                    <div className="cursor-pointer hover:opacity-50">{commentIcon}</div>
                    <div className="cursor-pointer hover:opacity-50">{sharePostIcon}</div>
                </div>
                <div className="cursor-pointer hover:opacity-50" onClick={handleSave}>{saved?saveFillIcon:saveIcon}</div>
            </div>

            {/* LIKE AND COMMENT */}
            <div className="font-semibold cursor-pointer" onClick={()=>setOpenLikeModal(true)}>
                <span>{allLikes.length}</span> {allLikes.length>1?"likes":"like"}
            </div>
            {/* CAPTION */}
            <div className="">
            <Link to={"/"+postedBy.username}>
            <span className="font-semibold mr-2">{postedBy.username}</span>
            </Link>
            <span>{foldCaption?caption.slice(0,50)+"...":caption}</span>
            </div>
            {foldCaption&&<div className="text-gray-400 cursor-pointer" onClick={()=>setFoldCaption(false)}>more</div>}
            
            {/* COMMENT SECTION */}
            {
                showMore&&
                <div >
                <ScrollToBottom className="w-full h-52 overflow-y-auto">
                {
                allComments.map((c)=>
                <div className="flex justify-between items-center py-2" id={c._id}>
                <div className="flex items-center">
                    <img src="" alt="avatar" className='rounded-full w-8 h-8 bg-gray-400 cursor-pointer' />
                </div>
                <div className="flex-1 ml-3">
                <div>
                <span className="text-sm font-semibold cursor-pointer">{c.user.username}</span>
                <span>{c.comment}</span>
                </div>
                    
                    <div className="space-x-3 text-xs text-gray-500">
                    <span className="">{c.createdAt}</span>
                    <span className="cursor-pointer">2 likes</span>
                    <span className="cursor-pointer">Reply</span>
                    </div>
                </div>
                <div className="cursor-pointer hover:opacity-50">{likeOutlineTiny}</div>
                </div>)
                }
                </ScrollToBottom>
                </div>
            }

            {(allComments.length>0)&&<div className="text-gray-400 cursor-pointer" onClick={()=>setShowMore(!showMore)}>{showMore?"Hide comments":`View all ${allComments.length} comments`}</div>}
            
            <div className="flex justify-center items-center relative">
                <input className="flex-1 outline-none focus:outline-none" 
                type="text" 
                placeholder='Add a comment...'
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                // onFocus={()=>(comment&&setShowSubmit(true))}
                // onBlur={()=>(!comment&&setShowSubmit(false))}
                />
                {showSubmit&&
                <div className="font-semibold text-primary-blue px-2 hover:text-black cursor-pointer"
                onClick={handlePostComment}>Post</div>}
                <div className="cursor-pointer hover:opacity-50" onClick={()=>{setShowEmoji(!showEmoji)}}>{smallEmojiIcon}</div>
                {showEmoji &&
                <ClickAwayListener onClickAway={()=>setShowEmoji(false)}>
                <div className="z-10 absolute bottom-10 right-0 rounded-lg" style={{boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)"}}>
                    <Picker
                        data={data}
                        set="native"
                        title="emojis"
                        them="light"
                        skin="1"
                        onEmojiSelect={(e) => setComment(comment + " " + e.native)}
                        // onClickOutside={()=>{console.log("Hit inside");showEmoji&&setShowEmoji(false)}}
                    />
                </div>
                </ClickAwayListener>}
            </div>
            <div className="h-[1px] bg-gray-300" style={{margin:"16px 0"}}></div>
        </div>
    )
}

export default PostItem