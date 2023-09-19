const express = require("express");
const { isAuthenticated } = require("../routeHandlers/authRouteHandlers");
const Router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getChats, createNewChat, deleteAllChats} = require("../routeHandlers/chatRouteHandlers");

Router.get("/chats",isAuthenticated,catchAsync(getChats));
Router.post("/newChat",isAuthenticated,catchAsync(createNewChat));
Router.delete("/allChats",isAuthenticated,catchAsync(deleteAllChats));

module.exports = Router;