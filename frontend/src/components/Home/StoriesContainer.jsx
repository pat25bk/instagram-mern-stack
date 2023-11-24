import React, { useEffect, useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInit';
import { ToastContainer, toast } from 'react-toastify';
import { Skeleton } from '@mui/material';
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants';

function StoriesContainer() {
  const [storiesList,setStoryList] = useState([]);
  const logginUser = useSelector((state)=>state.user.user);

  useEffect(()=>{
    const getUserDetails = async()=>{
      try{
        const res = await axiosInstance.get(`/api/user/${logginUser.username}/details`);
        console.log("following stories:",res.data)
        setStoryList(res.data.user.following);
      }catch(error){
        toast.error(error.message);
      }
    }
    getUserDetails();
    }
  ,[logginUser]);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 7,
    touchMove:true,
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

  return (
    <>
      <ToastContainer theme='colored'/>
      <Slider {...settings} className="w-full bg-white mb-3 overflow-hidden flex">
      {storiesList.length>0?
      storiesList.map((e,i)=>
        <div className="cursor-pointer">
        <div className="flex justify-center">
        <div className="rounded-full border-2 border-pink-500 w-16 h-16 flex justify-center items-center">
        <img  src={BASE_PROFILE_IMAGE_URL + e.avatar} alt="avatar" className='rounded-full w-14 h-14 bg-gray-400'/>
        </div>
        </div>
        <p className="text-xs text-center">Username</p>
        </div>
      )
      :
      Array(10).fill("").map((story,i)=>
        <div className="mx-5 flex flex-col items-center justify-center" id={i}>
        <Skeleton variant="circular" width={56} height={56}/>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={56}/>
        </div>
      )}
    </Slider>
    </>
  )
}

export default StoriesContainer