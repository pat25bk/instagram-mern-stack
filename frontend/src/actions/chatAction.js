import { ALL_CHATS_FAIL, ALL_CHATS_REQUEST, ALL_CHATS_SUCCESS } from "../reducers/chatReducers";
import axios from "../axiosInit";

export const getAllChats = async(dispatch)=>{
    dispatch(ALL_CHATS_REQUEST())
    try{
        const res = await axios.get("api/chat/chats");
        dispatch(ALL_CHATS_SUCCESS(res.data.chats));
    }catch(err){
        dispatch(ALL_CHATS_FAIL(err));
    }
}