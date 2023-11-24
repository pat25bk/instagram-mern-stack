import { ClickAwayListener, Dialog, DialogTitle, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { addNewPost } from '../../actions/postAction';
import { useDispatch, useSelector } from 'react-redux';
import { NEW_POST_CLEAR_ERROR, NEW_POST_RESET } from '../../reducers/postReducers';
import { useNavigate } from 'react-router-dom';
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants';
import { emojiIcon, smallEmojiIcon } from './SvgIcons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import "./emoji.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';


function NewPostModal({ open, onClose }) {
    const [caption, setCaption] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [postPreview, setPostReview] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const { success, error } = useSelector((state) => state.newPost);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginUser = useSelector((state) => state.user.user);
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(NEW_POST_CLEAR_ERROR());
        }

        if (success) {
            toast.success("New post added");
            dispatch(NEW_POST_RESET());
            navigate("/");
            setCaption("");
            setPostImage({});
        }
    }, [error, success, dispatch, navigate]);

    const handleSubmitNewPost = (e) => {
        e.preventDefault();
        if (!caption.trim()) {
            toast.error("Empty Caption");
            return
        }
        if (!postImage) {
            toast.error("Select Image");
            return
        }

        const formData = new FormData();
        formData.set("caption", caption);
        formData.set("post", postImage);
        addNewPost(dispatch, formData);

        onClose();
    }

    const handleFileChange = (e) => {
        const reader = new FileReader()
        setPostReview("");
        setPostImage("");
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPostReview(reader.result);
            }
        }

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            setPostImage(e.target.files[0]);
        }
    }

    const handleCloseNewPost=()=>{
        setCaption("");
        setPostImage(null);
        setPostReview(null);
        onClose();
    }
    
    console.log(postImage);
    return (
        <Modal open={open} onClose={handleCloseNewPost} className="flex justify-center items-center">
            <div className="bg-white rounded-xl flex flex-col h-[80%] overflow-hidden">
            <ToastContainer />
                <div className="p-3 text-base font-semibold flex justify-between">
                    <span className="flex-1 text-center w-3/4">Create new post</span>
                    <span className="text-primary-blue hover:text-blue-950 cursor-pointer text-sm"
                    onClick={handleSubmitNewPost}>Share</span>
                </div>
               
                <div className="flex-1 h-[80%] flex borde">
                    {postImage &&
                        <div className="h-full aspect-square bg-gray-400 flex justify-center">
                            <img className="h-full object-contain" src={postPreview} alt="post preview" />
                        </div>
                    }
                    <div className="text-sm w-[350px] h-[100%] overflow-y-scroll">
                        <div className="flex space-x-2 items-center px-4 pt-2">
                            <img src={BASE_PROFILE_IMAGE_URL + loginUser.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                            <p className="font-semibold">{loginUser.username}</p>
                        </div>
                        <form onSubmit={handleSubmitNewPost} className="flex flex-col space-y-3 mt-3 px-4 pb-2 border-b border-gray-300">
                            <textarea
                                type="text"
                                placeholder='Write a caption...'
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows="10"
                                cols="20"
                                className="outline-none resize-none text-base" />
                            <div className="flex justify-between relative">
                                <div className="opacity-40" onClick={() => setShowEmoji(!showEmoji)}>{emojiIcon}
                                </div>
                                <div>1/200</div>
                                {showEmoji &&
                                    <ClickAwayListener onClickAway={() => setShowEmoji(false)}>
                                        <div className="top-7 absolute rounded-lg z-10" style={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}>
                                            <Picker
                                                data={data}
                                                set="native"
                                                title="emojis"
                                                onEmojiSelect={(e) => setCaption(caption + " " + e.native)}
                                                previewPosition="none"
                                                searchPosition="none"
                                                emojiSize="20"
                                            />
                                        </div>
                                    </ClickAwayListener>}
                            </div>
                            {!postImage&&<input type="file" onChange={handleFileChange}/>}
                            {/* <button type="submit" className="w-full bg-primary-blue hover:bg-blue-500 py-2 text-white rounded-lg">POST</button> */}
                        </form>
                        
                        <div className="text-base py-2 border-b border-gray-300 px-4 flex justify-between">
                            <input className="flex-1 w-full outline-none" placeholder='Add location'/>          
                            <LocationOnIcon/>
                        </div>
                        
                        <div className="text-base py-2 border-b border-gray-300 px-4 flex justify-between">
                            <span>Accessibility</span>
                            <ExpandMoreIcon/>
                        </div>

                        <div className="text-base py-2 border-b border-gray-300 px-4 flex justify-between">
                            <span>Advanced Settings</span> 
                            <ExpandMoreIcon/>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default NewPostModal