const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendCookie = require("../utils/sendCookie");
const multer = require("multer");
const path = require("path");
const { findById } = require("../models/postModel");
const deleteFile = require("../utils/deleteFile");

exports.isAuthenticated = catchAsync(async(req,res,next)=>{
    // console.log(req.cookies);
    const {token} = req.cookies;
    if(!token) return next(new Error("Please login to access"));

    const payload = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(payload.id);
    next();
})

exports.signupHandler = async(req,res,next)=>{
    const {name,email,username,password} = req.body;
    const user = await User.findOne({
        $or:[{email},{username}]
    });
    if(user){
        if(user.username===username)
            res.status(401).json("Username already exists");
        else
            res.status(401).json("Email already exists");
    }
    const newUser = await User.create({
        name,
        email,
        username,
        password,
    })

    sendCookie(newUser,201,res);
}

exports.loginHandler = async(req,res,next)=>{
    const {userId, password} = req.body;
    console.log(req.body)
    const user = await User.findOne({
        $or:[
            {username:userId},
            {email: userId}
        ]
    }).select("+password");

    if(!user){
        return res.status(401).json("User doesn't exist")
    }

    const isPasswordMatched = await user.verifyPassword(password);

    if(!isPasswordMatched){
        return res.status(401).json("Password doesn't match")
    }
    
    // res.status(200).json(user);
    sendCookie(user,200,res);
}

exports.logoutHandler=async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
}
exports.updateProfile=async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const {name,username,email,website,bio} = req.body;
    const newUserData={
        name,
        username,
        email,
        website,
        bio
    }

    const existUser = await User.findOne({
        $or:[{email,username}]
    })

    
    if(existUser&&(existUser._id.toString()!==req.user._id.toString())){
        return res.status(404).json("Username or Email Already Used")
    }

    if(req.file){
        // console.log("file",user.avatar);
        if(user.avatar&&user.avatar!=""){
            await deleteFile('profiles/',user.avatar);
        }
        newUserData.avatar = process.env.AWS_ENABLE==='true'?req.file.location:req.file.filename;
        // console.log(req.file.filename);
        // console.log(req.file.location);
    }

    await User.findByIdAndUpdate(req.user._id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    })

    return res.status(200).json({
        sucess:true,
        message:"Profile Updated"
    })
}