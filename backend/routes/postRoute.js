const express = require("express");
const { isAuthenticated } = require("../routeHandlers/authRouteHandlers");
const catchAsync = require("../utils/catchAsync");
const { searchUsers}  = require("../routeHandlers/userRouteHandlers");
const multer = require("multer");
const path = require("path");
const { newPost, getAllPosts, getPostsOfFollowing, getPostDetails, newComment, deletePost, likePost, unlikePost } = require("../routeHandlers/postRouteHandlers");
const router = express.Router();

//Initilize storage engine for post images
const postStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(__dirname,"../public/uploads/posts/"));
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '_'+ Date.now() + path.extname(file.originalname))
    }
})

const postUpload = multer({
    storage: postStorage,
    limit: { fileSize: 1000000 * 10 }
});

// Create new post
router.post("/",isAuthenticated, postUpload.single("post"), catchAsync(newPost));

// Get all user's post for profile page 
router.get("/posts/all",isAuthenticated,catchAsync(getAllPosts))

// Get all the posts of all follwing users for newsfeed
router.get("/posts",isAuthenticated,catchAsync(getPostsOfFollowing))

// Get a specific post
router.get("/:postId",isAuthenticated,catchAsync(getPostDetails))

// Update post by the author 
router.put("/:postId")

// Add new like to the post
router.post("/:postId/like",isAuthenticated,catchAsync(likePost))
router.post("/:postId/unlike",isAuthenticated,catchAsync(unlikePost))

// Add new comment to the post
router.post("/:postId/comment",isAuthenticated,catchAsync(newComment))

// Delete comment form the post
// router.delete("/:postId/comment",isAuthenticated)

// Delete post
router.delete("/:postId",isAuthenticated,catchAsync(deletePost));

module.exports = router;