import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function StoriesContainer() {
  
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
      <Slider {...settings} className="w-full bg-white mb-3 overflow-hidden">
      {Array(20).fill("").map((e,i)=>
        <div className="mx-5">
        <div className="rounded-full border-2 border-purple-400 w-16 h-16 flex justify-center items-center">
        <img src="" alt="avatar" className='rounded-full w-14 h-14 bg-gray-400'/>
        </div>
        <div className="text-xs">Username</div>
        </div>
      )}
    </Slider>
    </>
  )
}

export default StoriesContainer