import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./dots.css"
import { commentIcon, saveFillIcon , likeFill, likeOutline, moreOptionsIcon, saveIcon, sharePostIcon, smallEmojiIcon, likeOutlineTiny } from '../Navbar/SvgIcons';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import ScrollToBottom from "react-scroll-to-bottom";
import { BASE_POST_IMAGE_URL } from '../../utils/constants';
import { Link } from 'react-router-dom';

function PostItem({_id, caption, likes, comments, image, postedBy, savedBy, createdAt}) {

    comments = Array(10).fill({}).map((e)=>{
        return {
        commenterId : "",
        avatar : "",
        content : "❤️❤️❤️❤️❤️",
        createdAt : "1d",
        likes : 1
        }
    })

    useEffect(()=>{
        if(caption.length>50){
            setFoldCaption(true);
        }
    },[])

    const [foldCaption,setFoldCaption]  = useState(true);
    const [allLikes,setAllLikes] = useState(likes);
    const [allComments,setAllComments] = useState(comments);
    const [allSavedBy, setAllSavedBy] = useState(savedBy);

    const [liked,setLiked] = useState(false);
    const [saved,setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [showEmoji,setShowEmoji] = useState(false);
    const [showMore,setShowMore] = useState(false);

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

    console.log(allComments);

    return (
        <div className="text-left text-sm space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src="" alt="avatar" className='rounded-full w-14 h-14 bg-gray-400 cursor-pointer' />
                    <span className="text-sm ml-3 font-semibold cursor-pointer">{postedBy.username}</span>
                    <span className="text-gray-400 ml-1">• 1d</span>
                </div>
                <div className="cursor-pointer">{moreOptionsIcon}</div>
            </div>
            <Slider {...settings} className="">
                {/* {images.map((e, i) => */}
                    <div className="w-[468px] h-[585px] bg-yellow-400">
                    <img className="w-full h-full object-cover" src={BASE_POST_IMAGE_URL+image} alt="post"/>
                    </div>
                    {/* )} */}
            </Slider>

            <div className="flex flex-row justify-between">
                <div className="flex justify-left space-x-3">
                    <div className="cursor-pointer hover:opacity-50" onClick={()=>setLiked(!liked)}>{liked?likeFill:likeOutline}</div>
                    <div className="cursor-pointer hover:opacity-50">{commentIcon}</div>
                    <div className="cursor-pointer hover:opacity-50">{sharePostIcon}</div>
                </div>
                <div className="cursor-pointer hover:opacity-50" onClick={()=>setSaved(!saved)}>{saved?saveFillIcon:saveIcon}</div>
            </div>

            <div className="font-semibold">
                1000 likes
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
                allComments.map((e)=>
                <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                    <img src="" alt="avatar" className='rounded-full w-8 h-8 bg-gray-400 cursor-pointer' />
                </div>
                <div className="flex-1 ml-3">  
                    <div className="text-sm font-semibold cursor-pointer">Username</div>
                    <div className="space-x-3 text-xs text-gray-500">
                    <span className="">{e.createdAt}</span>
                    <span className="">{e.likes} likes</span>
                    <span className="">Reply</span>
                    </div>
                </div>
                <div className="cursor-pointer hover:opacity-50">{likeOutlineTiny}</div>
                </div>)
                }
                </ScrollToBottom>
                </div>
            }

            <div className="text-gray-400 cursor-pointer" onClick={()=>setShowMore(!showMore)}>{showMore?"Hide comments":`View all ${allComments.length} comments`}</div>
            <div className="flex items-center">
                <input className="flex-1 outline-none focus:outline-none" type="text" placeholder='Add a comment...'
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                />
                <div className="cursor-pointer hover:opacity-50" onClick={()=>setShowEmoji(!showEmoji)}>{smallEmojiIcon}</div>
                {showEmoji &&
                <div className="absolute right-60 rounded-lg" style={{boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}>
                    <EmojiPicker
                        data={data}
                        set="native"
                        title="emojis"
                        onEmojiSelect={(e) => setComment(comment + " " + e.native)}
                    // onClickOutside={()=>setShowEmojis(!showEmojis)}
                    />
                </div>}
            </div>
            <div className="h-[1px] bg-gray-300 mb-10"></div>
        </div>
    )
}

export default PostItem