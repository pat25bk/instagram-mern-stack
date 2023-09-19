const Chat = require("../models/chatModel");

exports.getChats = async (req, res, next) => {
    const chats = await Chat.find({
        users: {
            $in: [req.user._id]
        }
    }).sort({ updatedAt: -1 }).populate("users latestMessage");

    res.status(200).json({
        success: true,
        chats
    })
}

exports.createNewChat = async (req, res, next) => {
    const userId = req.user._id;
    const receiverUserId = req.body.receiverUserId;
    if (!receiverUserId) {
        return res.status(400).json("Invalid userId");
    }

    //Check if there is already a chat documment 
    const existChat = await Chat.findOne({
        users: {
            $all: [userId, receiverUserId]
        }
    })

    if (existChat) {
        res.status(200).json({
            success: 200,
            newChat: existChat
        })
    }
    else {
        //Create new chat document
        const newChat = await Chat.create({
            users: [userId, receiverUserId]
        })

        res.status(200).json({
            success: true,
            newChat
        })
    }
}

exports.deleteChats = async (req, res, next) => {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(req.params.chatId);
}

exports.deleteAllChats = async (req, res, next) => {
    try {
        await Chat.deleteMany({})
        return res.status(200).json("All Chats Deleted Successfully!")
    } catch (err) {
        return res.status(400).json(err);
    }
}