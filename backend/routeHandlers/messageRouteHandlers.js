const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

exports.createNewMessage = async (req, res, next) => {
    const {chatId,content} = req.body;
    console.log(req.body);
    const newMessage = await Message.create({
        sender: req.user._id,
        chatId,
        content
    })

    await Chat.findByIdAndUpdate(chatId,{latestMessage:newMessage});

    res.status(200).json({
        success: true,
        newMessage
    })
}

exports.getAllMessages = async (req, res, next) => {
    console.log("chatId: ", req.params.chatId);
    const messages = await Message.find({ chatId: req.params.chatId });
    
    res.status(200).json({
        success: true,
        messages
    })
}
