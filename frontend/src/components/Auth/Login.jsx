import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../actions/userAction';
import logo from "../../assests/Instagram_logo.svg.png"
import facebookLogo from "../../assests/facebook-logo-png-2320.png";
import bgImage from "../../assests/signup-cover.png";
import googleStoreLogo from "../../assests/googleStoreLogo.png";
import msStoreLog from "../../assests/msStoreLogo.png";
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CLEAR_ERRORS } from '../../reducers/userReducers';
import BackdropLoader from '../Layouts/BackdropLoader';

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);

  function handleSubmitLogin(e) {
    e.preventDefault();
    // setTimeout(()=>loginUser(dispatch, userId, password),5000);
    loginUser(dispatch, userId, password);
    console.log(userId, password);
    setUserId("");
    setPassword("");
  }

  useEffect(()=>{
    if(error){
      console.log(error);
      toast.error(error);
      dispatch(CLEAR_ERRORS());
    }
    if(isAuthenticated){
      navigate(`/${user.username}`);
    }
  },[dispatch,error,isAuthenticated,user])

  return (
    <div className="flex flex-row h-screen text-sm bg-white">
      {loading&&<BackdropLoader/>}
      <ToastContainer theme="colored"/>
      <div className="flex-1 flex items-center justify-end pr-5">
        <img className="h-[95%] w-auto" src={bgImage} alt="background" />
      </div>

      <div className="flex-1 flex justify-start items-center pl-5">
        <div className="w-[350px] flex flex-col space-y-2">

          <div className="flex flex-col justify-center items-center border border-gray-300 space-y-5 py-3">
            <div className="w-1/2 my-3"><img src={logo} alt="logo" /></div>
            <form onSubmit={handleSubmitLogin} className="w-4/5 space-y-2 text-sm">
            <TextField
                label="Email/Username"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                size="small"
                fullWidth
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="small"
                fullWidth
            />
            
            {/* <input className="w-4/5 rounded-sm p-2 text-xs bg-gray-100 border border-gray-200" type="text" placeholder="Username or email" value={userId} onChange={(e) => setUserId(e.target.value)}></input>
            <input className="w-4/5 rounded-sm p-2 text-xs bg-gray-100 border border-gray-200" type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></input> */}
            <button type="submit" className="w-full rounded-md p-2 bg-[rgba(0,149,246,0.7)] text-white font-semibold" onClick={handleSubmitLogin}>Log in</button>
            </form>

            <div className="flex w-4/5 justify-center items-center">
              <div className="bg-slate-300 h-[0.5px] w-full flex-1"></div>
              <p className="text-gray-500 px-2 font-semibold">OR</p>
              <div className="bg-slate-300 h-[0.5px] w-full flex-1"></div>
            </div>
            
            <a className="flex font-semibold text-[#385185] text-sm" href="https://www.facebook.com/">
              <div className="h-5"><img className="h-full w-auto" src={facebookLogo} alt="facebook_logo" /></div>
              <span>Log in with Facebook</span>
            </a>

            <p className="text-xs text-[#385185]">Forgot password?</p>
          </div>

          <div className="border border-gray-300 text-center py-5 w-full">
            <span>Don't have an account?</span>
            <Link to="/signup">
            <span className="font-semibold text-primary-blue ml-1 hover:text-blue-800 cursor-pointer">Sign up</span>
            </Link>
          </div>

          <div>
            <p className="py-5">Get the app.</p>
            <div className="flex justify-center items-center space-x-3">
              <img className="w-auto h-10" src={googleStoreLogo} alt="google" />
              <img className="w-auto h-10" src={msStoreLog} alt="ms" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login