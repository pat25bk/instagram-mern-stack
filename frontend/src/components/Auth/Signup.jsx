import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../../actions/userAction';
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

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);

    function handleSubmitSignUp(e) {
        e.preventDefault();
        // setTimeout(()=>loginUser(dispatch, userId, password),5000);
        signupUser(dispatch, { email, password, username, name: fullName });
        setEmail("");
        setPassword("");
        setFullName("");
        setUsername("");
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(CLEAR_ERRORS());
        }
        if (isAuthenticated) {
            toast.success("Signed Up Successfull!");
            navigate(`/${user.username}`);
        }
    }, [dispatch, error, isAuthenticated, user])

    return (
        <div className="flex flex-row h-screen text-sm justify-center pt-5 bg-white">
            {loading && <BackdropLoader />}
            <ToastContainer theme="colored" />
            <div className="w-[350px] flex flex-col space-y-2">
                <div className="flex flex-col justify-center items-center border border-gray-300 py-3">
                    <div className="w-1/2 mt-5 mb-0"><img src={logo} alt="logo" /></div>
                    <p className='font-semibold text-gray-500 text-base px-10'>Sign up to see photos and videos from your friends.</p>

                    <form onSubmit={handleSubmitSignUp} className="w-4/5 space-y-2 text-sm mt-3">
                        <TextField
                            label="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            size="small"
                            fullWidth
                        />

                        <TextField
                            label="Full Name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            size="small"
                            fullWidth
                        />

                        <TextField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                        <p className="text-xs text-gray-500 mt-3">
                            People who use our service may have uploaded your contact information to Instagram. Learn More
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
                        </p>
                        {/* <input className="w-4/5 rounded-sm p-2 text-xs bg-gray-100 border border-gray-200" type="text" placeholder="Username or email" value={userId} onChange={(e) => setUserId(e.target.value)}></input>
            <input className="w-4/5 rounded-sm p-2 text-xs bg-gray-100 border border-gray-200" type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></input> */}
                        <button type="submit"
                            className="w-full rounded-md p-2 bg-[rgba(0,149,246,0.7)] text-white font-semibold"
                        >Sign up</button>
                    </form>

                    <div className="flex w-4/5 justify-center items-center mt-3">
                        <div className="bg-slate-300 h-[0.5px] w-full flex-1"></div>
                        <p className="text-gray-500 px-2 font-semibold">OR</p>
                        <div className="bg-slate-300 h-[0.5px] w-full flex-1"></div>
                    </div>

                    <a className="flex font-semibold text-[#385185] text-sm my-3" href="https://www.facebook.com/">
                        <div className="h-5"><img className="h-full w-auto" src={facebookLogo} alt="facebook_logo" /></div>
                        <span>Log in with Facebook</span>
                    </a>
                </div>

                <div className="border border-gray-300 text-center py-5 w-full">
                    <span>Have an account?</span>
                    <Link to="/login">
                        <span className="font-semibold text-primary-blue ml-1 hover:text-blue-800 cursor-pointer">Log in</span>
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
    )
}

export default Signup