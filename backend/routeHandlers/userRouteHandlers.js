const User = require("../models/userModel");
const sendCookie = require("../utils/sendCookie");

//Search Users
exports.searchUsers = async(req,res,next)=>{
    const keyword = req.query.keyword;
    let users = [];
    if(keyword){
        users = await User.find({
            $or: [
                {
                    name: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    username: {
                        $regex: keyword,
                        $options: "i",
                    }
                }
            ]
        });
        console.log(users);
    }
    else{
        users = await User.find();
    }
    res.status(200).json(users);
}

//Follow
exports.followUser = async(req,res,next)=>{
    const userToFollow = await User.findById(req.params.userId);
    const selfUser = await User.findById(req.user._id);

    if(!userToFollow) return res.status(404).json("User Not Found");

    if(selfUser.following.includes(userToFollow._id)){
        return res.status(200).json("User Already Followed!");
    }

    selfUser.following.push(userToFollow._id);
    userToFollow.followers.push(selfUser._id);

    await selfUser.save();
    await userToFollow.save();

    return res.status(200).json("User Followed");
}

exports.unfollowUser = async(req,res,next)=>{
    const userToFollow = await User.findById(req.params.userId);
    const selfUser = await User.findById(req.user._id);

    if(!userToFollow) return res.status(404).json("User Not Found");

    const followingIdx = selfUser.following.indexOf(userToFollow._id);
    selfUser.following.splice(followingIdx,1);
    
    const followerIdx = userToFollow.followers.indexOf(selfUser._id);
    userToFollow.followers.splice(followerIdx,1);

    await selfUser.save();
    await userToFollow.save();
    return res.status(200).json("User Unfollowed");
}

exports.getUserGeneral = async(req,res,next)=>{
    const user = await User.findById(req.params.userId);
    res.status(200).json({
        success:true,
        user
    })
}

exports.getAccountDetails = async(req,res,next)=>{
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success:true,
        user
    })
}

exports.getUserDetails = async(req,res,next)=>{
    const user = await User.findOne({"username":req.params.userId})
    .populate("followers following")
    .populate({
        path:"posts",
        populate:{
            path:'comments',
            populate:{
                path:"user"
            }
        }
    })
    .populate({
        path: 'posts',
        populate: {
            path: 'postedBy'
        }
    })
    .populate({
        path:"saved",
        populate:{
            path:'comments',
            populate:{
                path:"user"
            }
        }
    })
    .populate({
        path: 'saved',
        populate: {
            path: 'postedBy'
    }})

    return res.status(200).json({
        success:true,
        user
    })
}