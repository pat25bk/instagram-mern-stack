import { LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS } from "../reducers/userReducers"
import axios from "../axiosInit"
import axiosInstance from "../axiosInit";

export const loginUser = async(dispatch,userId,password)=>{
    dispatch(LOGIN_USER_REQUEST());
    try{
        const res = await axios.post("/api/auth/login",{userId,password});
        console.log("successfull:",res.data);
        dispatch(LOGIN_USER_SUCCESS(res.data.user));
    }catch(err){
        console.log("error:",err);
        dispatch(LOGIN_USER_FAIL((err.response.data)));
    }
}

export const fetchUserDetails=async(dispatch,username)=>{
    dispatch(USER_DETAILS_REQUEST());
    try{
        const res = await axiosInstance(`/api/user/${username}/details`);
        dispatch(USER_DETAILS_SUCCESS(res.data.user));
    }catch(err){
        console.log(err);
        dispatch(USER_DETAILS_FAIL(err.response.data));
    }
}

export const signupUser = async(dispatch,signupInfo)=>{

}

export const reloadUser = async(dispatch)=>{
    dispatch(LOAD_USER_REQUEST());
    try{
        const res = await axios.get("/api/user/me");
        // console.log("successfull:",res.data);
        dispatch(LOAD_USER_SUCCESS(res.data.user));
    }catch(err){
        // console.log("error:",err);
        dispatch(LOAD_USER_FAIL((err.response.data)));
    }
}