import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Home/dots.css"
import { commentIcon, saveFillIcon , likeFill, likeOutline, moreOptionsIcon, saveIcon, sharePostIcon, smallEmojiIcon, likeOutlineTiny } from '../Navbar/SvgIcons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import ScrollToBottom from "react-scroll-to-bottom";
import { BASE_POST_IMAGE_URL, BASE_PROFILE_IMAGE_URL } from '../../utils/constants';
import { Link } from 'react-router-dom';
import PostOptionsDialog from '../Home/PostOptionsDialog';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInit';
import { toast } from 'react-toastify';
import { ClickAwayListener } from '@mui/material';
import UsersModal from '../Profile/UsersModal';

function PostDialogItem({_id, caption, likes, comments, image, postedBy, savedBy, createdAt}) {
    const [foldCaption,setFoldCaption]  = useState((caption.length>50)?true:false);
    // const [allLikes,setAllLikes] = useState(likes);
    // const [allComments,setAllComments] = useState(comments);
    // const [allSavedBy, setAllSavedBy] = useState(savedBy);
    const [postDetails,setPostDetails] = useState(null);

    const [liked,setLiked] = useState(false);
    const [saved,setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [showEmoji,setShowEmoji] = useState(false);
    // const [showMore,setShowMore] = useState(false);
    const [showPostOptions,setShowPostOptions] = useState(false);
    const [showSubmit,setShowSubmit] = useState(true);
    const [openLikeModal,setOpenLikeModal] = useState(false);

    useEffect(()=>{
        const fetchPostDetails = async()=>{
            try{
                const res = await axiosInstance.get(`/api/post/${_id}`);
                setPostDetails(res.data.post);
            }catch(error){
                toast.error(error.message);
            }
        }
        fetchPostDetails();
    },[_id]);

    const logginUser = useSelector((state)=>state.user.user);

    useEffect(()=>{
        if(postDetails?.likes.some((u)=>u._id=logginUser._id)){
            setLiked(true);
        }
    },[postDetails,logginUser]);
    
    useEffect(()=>{
        if(logginUser.saved.includes(_id)){
            setSaved(true);
        }
    },[logginUser,_id]);

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
            // setAllLikes(res.data.post.likes);
            setPostDetails(res.data.post);
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
            // setAllComments(resNewPost.data.post.comments);
            setPostDetails(resNewPost.data.post);
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

    console.log(postDetails?.likes);
    const handlePostOptionsClose=()=>{
        setShowPostOptions(false);
    }

    return (
        postDetails&&
        <div className='w-full h-full flex flex-row text-left text-sm'>
            <UsersModal 
            open={openLikeModal} 
            onClose={()=>setOpenLikeModal(false)}
            userList={postDetails.likes}
            modalTitle="Likes"
            />
           
            {/* POST IMAGE */}
            <div className="flex-1 w-2/3 h-full">
            {/* <Slider {...settings}> */}
                {/* {images.map((e, i) => */}
                {/* <div className="h-[90vh]"> */}
                    <img className="object-cover h-full" src={BASE_POST_IMAGE_URL+image} alt="post"/>
                {/* </div> */}
                    {/* )} */}
            {/* </Slider> */}
            </div>

            <div className="flex-1 flex flex-col w-1/2 h-full">
             {/* POST HEADER */}
             <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
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

            <div className="flex-1 min-h-[70%] px-5 py-3 border-b border-gray-200">
            {/* CAPTION */}
            <div className="">
            <Link to={"/"+postedBy.username}>
            <span className="font-semibold mr-2">{postedBy.username}</span>
            </Link>
            <span>{foldCaption?caption.slice(0,50)+"...":caption}</span>
            </div>
            {foldCaption&&<div className="text-gray-400 cursor-pointer" onClick={()=>setFoldCaption(false)}>more</div>}
            
            {/* COMMENT SECTION */}
             
            <div >
            <ScrollToBottom className="w-full h-52 overflow-y-auto">
            {
            postDetails.comments.map((c)=>
            <div className="flex justify-between items-center py-2" id={c._id}>
            <div className="flex items-center">
                <img src={BASE_PROFILE_IMAGE_URL+c.user.avatar} alt="avatar" className='rounded-full w-8 h-8 bg-gray-400 object-cover cursor-pointer' />
            </div>
            <div className="flex-1 ml-3">
            <div>
            <span className="text-sm font-semibold cursor-pointer mr-1">{c.user.username}</span>
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
            </div>

            {/* OPTIONS */}
            <div className="px-5 py-3 space-y-2 border-b border-gray-200">
            <div className="flex flex-row justify-between">
                <div className="flex justify-left space-x-3">
                    <div className="cursor-pointer hover:opacity-50" onClick={handleLike}>{liked?likeFill:likeOutline}</div>
                    <div className="cursor-pointer hover:opacity-50">{commentIcon}</div>
                    <div className="cursor-pointer hover:opacity-50">{sharePostIcon}</div>
                </div>
                <div className="cursor-pointer hover:opacity-50" onClick={handleSave}>{saved?saveFillIcon:saveIcon}</div>
            </div>

            <div className="font-semibold cursor-pointer" onClick={()=>setOpenLikeModal(true)}>
                <span>{postDetails.likes.length}</span> {postDetails.likes.length>1?"likes":"like"}
            </div>
            </div>

            {/* POST COMMENT */}
            <div className="flex justify-center items-center relative px-5 py-3">
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
                <div className="z-10 absolute bottom-10 right-0 rounded-lg bg-yellow-300 border border-red-600" style={{boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)"}}>
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
          </div>
        </div>
    )
}

export default PostDialogItem