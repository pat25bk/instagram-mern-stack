const Post = require("../models/postModel");
const User = require("../models/userModel");
const {delelteFile} = require("../utils/awsFunctions");

exports.newPost = async(req,res,next)=>{
    const postData = {
        caption:req.body.caption,
        postedBy:req.user._id,
        image:process.env.AWS_ENABLE==='true'?req.file.location:req.file.filename
    }
    // console.log(req.file);

    const post = await Post.create(postData);
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();

    return res.status(201).json({
        success:true,
        post
    });
}

exports.likePost = async(req,res,next)=>{
    // Check if the wanted post still exist in the database
    const post = await Post.findById(req.params.postId);
    
    if(!post){
        return res.status(404).json("Post Not Found!");
    }

    if(post.likes.includes(req.user._id)){ //Remove like of this userId
        return res.status(200).json("Post Already Liked");
    }else{// Add like
        post.likes.push(req.user._id);

        await post.save();

        return res.status(200).json({
            success:true,
            message:"Post Liked"
        })
    }
}

exports.unlikePost = async(req,res,next)=>{
    // Check if the wanted post still exist in the database
    const post = await Post.findById(req.params.postId);
    
    if(!post){
        return res.status(404).json("Post Not Found!");
    }

    if(post.likes.includes(req.user._id)){ //Remove like of this userId
        const index = post.likes.indexOf(req.user._id);
        post.likes.splice(index,1);

        await post.save();

        return res.status(200).json({
            success:true,
            message:"Post Unliked"
        })
    }else{// Add like
        return res.status(200).json("Post Already Unliked")
    }
}

exports.newComment = async(req,res,next)=>{

    const post = await Post.findById(req.params.postId);

    if(post){
        post.comments.push({
            user:req.user._id,
            comment:req.body.comment
        })

        await post.save();

        return res.status(200).json(
            {
                success:true,
                message:"New Comment Added!"
            });
    }else{
        return res.status(404).json("No Post Found!");
    }
}

exports.deletePost = async(req,res,next)=>{
    const post = await Post.findById(req.params.postId);

    if(!post){
        return res.status(404).json("Post Not Found!");
    }
    
    // await deleteFile("posts/",post.image);

    await post.remove();

    const user = await User.findById(req.user._id);
    const index = user.posts.indexOf(req.params.postId);
    user.posts.splice(index,1);
    await user.save();

    return res.status(200).json({
        success:true,
        message:"Post Deleted"
    });
};

exports.updatePost = async(req,res,next)=>{
    const post = await Post.findById(req.params.id);

    if(!post){
        return res.status(404).json("Post Not Found!");
    }

    post.caption = req.body.caption;

    await post.save();

    res.status(200).json({
        success:true,
        message:"Post Updated"
    });
};

exports.getPostsOfFollowing = async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const currentPage = Number(req.query.page)||1;
    const skipPosts = 4*(currentPage-1);
    const totalPosts = await Post.find({
        postedBy:{
            $in:user.following
        }
    }).countDocuments();

    const posts = await Post.find({
        postedBy:{
            $in:user.following
        }
    }).populate("postedBy likes").populate({
        path:"comments",
        populate:{
            path:"user"
        }
    }).sort({ $natural: -1 }).limit(4).skip(skipPosts)

    console.log(skipPosts);
    return res.status(200).json({
        success:true,
        posts,
        totalPosts
    })
}

exports.getAllPosts=async(req,res,next)=>{
    const posts = await Post.find().populate("likes");

    return res.status(200).json({
        posts
    });
}

exports.getPostDetails=async(req,res,next)=>{
    const post = await Post.findById(req.params.postId)
    .populate("postedBy likes")
    .populate({
        path:"comments",
        populate:{
            path:'user'
        }
    });

    if (!post){
        return res.status(404).json("Post Not Found");
    }else{
        return res.status(200).json({
            success:true,
            post
        });
    }
}
