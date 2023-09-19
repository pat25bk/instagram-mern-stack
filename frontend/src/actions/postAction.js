import axiosInstance from "../axiosInit";
import { NEW_POST_FAIL, NEW_POST_REQUEST, NEW_POST_SUCCESS } from "../reducers/postReducers"

export const addNewPost=async(dispatch,postData)=>{
    dispatch(NEW_POST_REQUEST());
    try{
        const config = { header: { "Content-Type": "application/json" } }
        const res = await axiosInstance.post("/api/post/",postData,config);
        dispatch(NEW_POST_SUCCESS(res.data.newPost));
    }catch(error){
        dispatch(NEW_POST_FAIL(error.response.data.message));
    }
}