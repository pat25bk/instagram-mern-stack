import React, { useState } from 'react'
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../axiosInit';

function EditProfile() {
    const loginUser = useSelector((state)=>state.user.user);
    const [avatarFile,setAvatarFile] = useState(loginUser.avatar);
    const [gender,setGender] = useState('')
    const [bio,setBio] = useState(loginUser.bio);
    const [website,setWebsite] = useState(loginUser.website);
    const [name,setName] = useState(loginUser.name);
    const [username,setUsername] = useState(loginUser.username);
    const [email,setEmail] = useState(loginUser.email);
    const [suggest,setSuggest] = useState('');

    // const handleProfileUpdate=async()=>{
    //     try{
    //         const res = await axiosInstance.put('/api/user/info',{bio:bio});
    //         toast.success(res.data.message);
    //     }catch(error){
    //         toast.error(error.message)
    //     }
    // }

    const handleProfileUpdate=async()=>{
        const formData = new FormData();
        formData.set("name",name);
        formData.set("username",username);
        formData.set("email",email);
        formData.set("website",website);
        formData.set("bio",bio);
        formData.set("avatar",avatarFile);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        try{
            const res = await axiosInstance.put('/api/auth/update/profile',formData,config);
            toast.success(res.data.message);
        }catch(error){
            toast.error(error.message);
        }
    }
    
    console.log(avatarFile,gender,bio,website,suggest);
    return (
    <div className="w-[100vw] mt-14 flex justify-center">
    <ToastContainer/>
    <div className="flex flex-col w-1/3 mt-10 space-y-5">
        <div className="text-2xl text-left py-5">Edit profile</div>
        <div className="flex">
            <div className="w-1/4 font-semibold flex justify-end pr-5">
                <img className="w-11 h-11 rounded-full object-cover" src={BASE_PROFILE_IMAGE_URL + loginUser.avatar} alt="avatar" />
            </div>
            <div className="w-3/4 text-left">
                <p>{loginUser.username}</p>
                <label>
                <input type="file" name="Choose New Avatar" onChange={(e)=>setAvatarFile(e.target.files[0])}/>
                <button 
                
                className="bg-primary-blue hover:bg-blue-500 text-white py-1 px-3 font-semibold rounded-lg">Update</button>
                {/* <span className="text-primary-blue font-semibold hover:text-blue-950">Change profile photo</span> */}
                </label>
            </div>
        </div>
        <div className="flex">
            <div className="w-1/4 font-semibold text-right pr-5">
                <p>Website</p>
            </div>
            <div className="w-3/4">
                <input type="text" 
                className="w-full p-1 border border-gray-300 rounded-sm" 
                placeholder='Website'
                value={website}
                onChange={(e)=>setWebsite(e.target.value)}
                />
            </div>
        </div>
        <div className="flex">
            <div className="w-1/4 font-semibold text-right pr-5">
                <p>Bio</p>
            </div>
            <div className="w-3/4">
            <textarea className="w-full border border-gray-300 rounded-sm"
            value={bio}
            onChange={(e)=>setBio(e.target.value)}></textarea>
            </div>
        </div>
        <div className="flex">
            <div className="w-1/4 font-semibold text-right pr-5">
            <p>Gender</p>
            </div>
            <div className="w-3/4">
                <select className="w-full" onChange={(e)=>setGender(e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                </select>
            </div>
        </div>
        <div className="flex">
            <div className="w-1/4 font-semibold text-right pr-5">
            <p>Show account suggestions on profiles</p>
            </div>
            <div className="w-3/4 text-left">
            <input type="checkbox" onChange={(e)=>setSuggest(e.target.checked?"yes":"no")}/>
            <label>Choose whether people can see similar account suggestions on your profile, and whether your account can be suggested on other profiles.[?]</label>
            </div>
        </div>
        <div>
            <button onClick={handleProfileUpdate} className="bg-primary-blue hover:bg-blue-500 text-white py-1 px-3 font-semibold rounded-lg">Submit</button>
        </div>
    </div>
    </div>
  )
}

export default EditProfile