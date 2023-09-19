const express = require("express");
const { isAuthenticated } = require("../routeHandlers/authRouteHandlers");
const catchAsync = require("../utils/catchAsync");
const {getAllMessages, createNewMessage} = require("../routeHandlers/messageRouteHandlers");
const router = express.Router();

router.get("/:chatId",isAuthenticated,catchAsync(getAllMessages));
router.post("/",isAuthenticated, catchAsync(createNewMessage));

module.exports = router;