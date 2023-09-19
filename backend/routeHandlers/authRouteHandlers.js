const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendCookie = require("../utils/sendCookie");
const multer = require("multer");
const path = require("path");

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

    res.status(200).json(newUser)
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