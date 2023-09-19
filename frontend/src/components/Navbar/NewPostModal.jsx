import { Dialog, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { addNewPost } from '../../actions/postAction';
import { useDispatch, useSelector } from 'react-redux';
import { NEW_POST_CLEAR_ERROR, NEW_POST_RESET } from '../../reducers/postReducers';
import { useNavigate } from 'react-router-dom';

function NewPostModal({open,onClose}) {
    const [caption,setCaption] = useState("");
    const [postImage,setPostImage] = useState(null);
    const {success,error} = useSelector((state)=>state.newPost);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(error){
            toast.error(error);
            dispatch(NEW_POST_CLEAR_ERROR());
        }

        if(success){
            toast.success("New post added");
            dispatch(NEW_POST_RESET());
            navigate("/");
            setCaption("");
            setPostImage({});
        }
    },[error,success,dispatch,navigate]);

    const handleSubmitNewPost=(e)=>{
        e.preventDefault();
        if(!caption.trim()){
            toast.error("Empty Caption");
            return 
        }
        if(!postImage){
            toast.error("Select Image");
            return
        }

        const formData = new FormData();
        formData.set("caption",caption);
        formData.set("post",postImage);
        addNewPost(dispatch,formData);
        
        onClose();
    }

    const handleFileChange=(e)=>{
        setPostImage(e.target.files[0]);
    }

    console.log(postImage);
  return (
    <Dialog open={open} onClose={onClose}>
    <ToastContainer/>
    <DialogTitle>New Post</DialogTitle>
    <div className="p-3">
    <form onSubmit={handleSubmitNewPost} className="flex flex-col space-y-2">
        <textarea type="text" placeholder='write your caption...' value={caption} onChange={(e)=>setCaption(e.target.value)}/>
        <input type="file" onChange={handleFileChange}/>
        <button type="submit" className="w-full bg-primary-blue hover:bg-blue-500 py-2 text-white">POST</button>
    </form>
    </div>
    </Dialog>
  )
}

export default NewPostModal