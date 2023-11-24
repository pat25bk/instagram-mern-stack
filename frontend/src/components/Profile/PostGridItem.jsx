import React, { useState } from 'react'
import { BASE_POST_IMAGE_URL } from '../../utils/constants'
import { likeFillWhite,commentFillIcon } from '../Navbar/SvgIcons'
import { Dialog } from '@mui/material';
import PostItem from '../Home/PostItem';
import PostDialogItem from './PostDialogItem';
function PostGridItem({postData}){
    const [like,setLike] = useState(false);
    const [comment,setComment] = useState("");
    const [openDialog,setOpenDialog] = useState(false);

  return (
    <>
    <div className="relative w-full aspect-square bg-yellow-500" onClick={()=>setOpenDialog(true)}>
    <img className="w-full h-full object-cover" src={BASE_POST_IMAGE_URL+postData.image} alt="post"/>
    <div className="absolute top-0 w-full h-full bg-black/25 opacity-0 hover:opacity-100
    flex justify-center items-center space-x-8
    font-bold text-white text-lg
    ">
        <div className="flex space-x-2 items-center">
            {likeFillWhite}
            <span>{postData.likes.length}</span>
        </div>
        <div className="flex space-x-2 items-center ">
            {commentFillIcon}
            <span>{postData.comments.length}</span></div>
    </div>
    </div>
    <Dialog open={openDialog} onClose={()=>setOpenDialog(false)} maxWidth="xl">
    <div className="w-[70vw] h-[90vh]">
      <PostDialogItem  {...postData}/>
    </div>
    </Dialog>
    </>
  )
}

export default PostGridItem