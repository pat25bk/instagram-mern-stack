const express = require("express");
const { isAuthenticated } = require("../routeHandlers/authRouteHandlers");
const catchAsync = require("../utils/catchAsync");

const { searchUsers, followUser, unfollowUser, getUserProfile, getUserDetails, getUserGeneral, getAccountDetails, savePost, unsavePost, updateProfile}  = require("../routeHandlers/userRouteHandlers");

const router = express.Router();

// Retrieve user account info
router.get("/users",isAuthenticated,catchAsync(searchUsers));

//Reload User Data
router.get("/me",isAuthenticated,catchAsync(getAccountDetails))

// Retriev user info
router.get("/:userId",isAuthenticated,catchAsync(getUserGeneral));

// Retriev user info
router.get("/:userId/details",isAuthenticated,catchAsync(getUserDetails));

// Update user info
router.put("/info",isAuthenticated,catchAsync(updateProfile));
router.put("/avatar");

// Follow
router.post("/follow/:userId",isAuthenticated,catchAsync(followUser))

// Unfollow
router.post("/unfollow/:userId",isAuthenticated,catchAsync(unfollowUser))

// Add a post to saved library
router.post("/save/:postId",isAuthenticated,catchAsync(savePost));
router.post("/unsave/:postId",isAuthenticated,catchAsync(unsavePost));
// Delete account
router.delete("/");

module.exports = router;