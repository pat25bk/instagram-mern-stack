import axios from "../axiosInit"
import { ALL_MESSAGES_FAIL, ALL_MESSAGES_REQUEST, ALL_MESSAGES_SUCCESS, NEW_MESSAGE_FAIL, NEW_MESSAGE_REQUEST, NEW_MESSAGE_SUCCESS } from "../reducers/messageReducers";

export const getAllMessages = async(dispatch,chatId)=>{
    dispatch(ALL_MESSAGES_REQUEST());
    try{
        const res = await axios.get("/api/message/"+chatId);
        // console.log(res.data);
        dispatch(ALL_MESSAGES_SUCCESS(res.data.messages));
    }catch(err){
        // console.log(err);
        dispatch(ALL_MESSAGES_FAIL((err.response.data)));
    }
}

export const addNewMessage = async(dispatch,chatId,content)=>{
    dispatch(NEW_MESSAGE_REQUEST());
    try{
        const res = await axios.post("/api/message/",{chatId,content});
        dispatch(NEW_MESSAGE_SUCCESS(res.data.newMessage));
    }catch(err){
        console.error(err);
        dispatch(NEW_MESSAGE_FAIL(err.response.data))
    }
}