const express = require("express");
const mongoose = require("mongoose");
const User = require("../backend/models/userModel");
const CustomError = require("./utils/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // To access variable in .env file

const PORT = process.env.PORT || 4000;
// Establish connection to Database
const dbURL= process.env.ATLAS_ENABLE==='true'?process.env.ATLAS_URL:process.env.MONGO_URI;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error))

// HTTP Express server
const app = express();
// Add middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // You may need this if you are using cookies or sessions
  }));

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const postRoute = require("./routes/postRoute");

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/post",postRoute);

app.get("/", (req, res, next) => {
    res.send("Hello World");
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

const server = app.listen(PORT, () => console.log("Server is running on port ",PORT));

//Websocket server
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("🚀 Someone connected!, SOCKET_ID:",socket.id);

    socket.on("addUser", (userId) => {
        addUser(userId,socket.id);
        io.emit("getUsers", users);
        console.log("User List After Add Users:",users);
    })

    socket.on("sendMessage",({senderId, receiverId, content})=>{
        const user = getUser(receiverId);
        console.log("server socket receive:",content);
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            content
        });
    })

    socket.on("typing",({senderId,receiverId})=>{
        // console.log("Got typing event from: ",senderId);
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("typing",senderId);
    });

    socket.on("typing stop",({senderId,receiverId})=>{
        // console.log("Got typing stop event from: ",senderId);
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("typing stop",senderId);
    })

    socket.on("disconnect", () => {
        console.log("⚠️ Someone disconnected");
        removeUser(socket.id);
        io.emit("getUsers",users);
    });
})