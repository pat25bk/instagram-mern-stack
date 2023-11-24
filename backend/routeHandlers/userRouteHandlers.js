const User = require("../models/userModel");
const sendCookie = require("../utils/sendCookie");
const multer = require("multer");

const avatarStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(__dirname,"../public/upload/profiles/"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Data.now()+'-'+Math.round(Math.random()*1e9);
        cb(null,file.fieldname +'_'+ uniqueSuffix + path.extname(file.originalname))
    }
})

const avatarUpload = multer({
    storage: avatarStorage,
    limit: { fileSize: 1000000 * 10 }
});

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
    if(user){
    return res.status(200).json({
        success:true,
        user
    })}
    else{
        return res.status(404).json("User Not Found");
    }
}

exports.savePost = async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    if(user.saved.includes(req.params.postId)){
        return res.status(200).json({
            success:true,
            message:"Post Already Saved"
        })
    }
    else{
        user.saved.push(req.params.postId);
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Post Saved"
        })
    }
}

exports.unsavePost = async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    if(user.saved.includes(req.params.postId)){
        const index = user.saved.indexOf(req.params.postId);
        user.saved.splice(index,1);
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Post Unsaved"
        })
    }
    else{
        return res.status(200).json({
            success:true,
            message:"Post Already Unsaved"
        })
    }
}

exports.updateProfile=async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    user.bio = req.body.bio;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Profile Updated"
    })
}