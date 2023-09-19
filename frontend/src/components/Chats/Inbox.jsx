import React, { useRef, useState, useEffect } from 'react'
import { addPhoto, audioCallIcon, chatIcon, emojiIcon, infoIcon, likeOutline, videoCallIcon, voiceClipIcon } from '../Navbar/SvgIcons'
import sampleAvatar from "../Navbar/logo192.png"
import { useParams } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import Sidebar from './Sidebar';
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { ALL_MESSAGES_ADD } from '../../reducers/messageReducers';
import { addNewMessage, getAllMessages } from '../../actions/messageAction';
import Message from './Message';
import { ALL_CHATS_ADD, ALL_CHATS_UPDATE } from '../../reducers/chatReducers';
import SpinLoader from '../Layouts/SpinLoader';
import SearchModal from './SearchModal';

const contactList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const userList = []
contactList.map((i) => {
    let tmpUser = {}
    tmpUser.id = i;
    tmpUser.name = `Name ${i}`;
    tmpUser.username = `username${i}`;
    tmpUser.avatar = sampleAvatar;
    userList.push(tmpUser);
    return 0;
})

function Inbox() {
    const contactList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const params = useParams();
    // const userId = params.userId;
    const chatId = params.chatId;
    const dispatch = useDispatch();
    const scrollRef = useRef();
    const socket = useRef();

    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);
    const maxLines = 5;

    const fileRef = useRef(null);

    const [arrivalMessage, setArrivalMessage] = useState(null);//state of new arrival message

    const [typing, setTyping] = useState(false); // typing state of local user
    const [isTyping, setIsTyping] = useState(false); // typing state of remote user
    const [typingData, setTypingData] = useState({});// typing data of remote user received on socket

    const [isOnline, setIsOnline] = useState(false);//for show green dot when sender is online
    const [showEmojis, setShowEmojis] = useState(false);//for showing the emoji keyboard

    const [showSearch, setShowSearch] = useState(false);//for opening the search modal to start a new chat
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [files, setFiles] = useState([]);

    const loggedInUser = useSelector((state) => state.user.user);
    const [friendInfo, setFriendInfo] = useState(null);
    const newMessage = useSelector(state => state.newMessage.newMessage);
    const chats = useSelector(state => state.allChats.chats);
    const {loading, messages:allMessages} = useSelector((state) => state.allMessages);
    

    // console.log("content of new mesg", newMessage);
    console.log("typingData:",typingData);
    console.log("isTyping:", isTyping);

    // Loading info of chatting friend
    useEffect(() => {
        if (chatId) {
            const currentChat = chats.find((chat) => chat._id === chatId);
            const friendInfo = currentChat?.users.find((user) => user._id !== loggedInUser._id);
            setFriendInfo(friendInfo);
        }
    }, [chatId,chats,loggedInUser]);
    
    useEffect(() => {
        // Set the initial height of the textarea
        adjustHeight();
    }, [message]);

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    },[allMessages]);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
            const maxScrollHeight = maxLines * lineHeight;
            if (message === "") {
                textarea.style.height = `${lineHeight}px`;
                textarea.style.overflowY = 'hidden';
            }
            else {
                textarea.style.height = `${Math.min(scrollHeight, maxScrollHeight)}px`;
                textarea.style.overflowY = 'scroll';
            }
        }
        // console.log(lineHeight, scrollHeight);
    };

    const handleFileUpload = (e) => {
        const selectedFiles = e.target.files;
        const tmpFileNames = [];
        for (const file of selectedFiles) {
            tmpFileNames.push(file.name)
        }
        setFiles(tmpFileNames);
    }

    const handleSendMessage = (e, msg = message) => {
        // console.log(msg);
        // Send to websocket server
        socket?.current.emit("sendMessage", {
            senderId: loggedInUser._id,
            receiverId: friendInfo._id,
            content: msg
        });

        // Push to message redux state
        addNewMessage(dispatch, chatId, msg);
        setMessage("");
    }

    useEffect(() => {
        console.log("new message change state");
        const newMessageContent = newMessage.payload?.content;
        if (newMessageContent) {
            console.log("dispath add new message");
            dispatch(ALL_MESSAGES_ADD(newMessage.payload));
        }
    }, [dispatch, newMessage])

    // Loading all messages of this chat
    useEffect(() => {
        chatId&&getAllMessages(dispatch, chatId);
    }, [dispatch, chatId])

    // console.log(loggedInUser,friendInfo);
    // console.log(allMessages);
    const handleTyping = (e) => {
        setMessage(e.target.value);
        setTyping(true);
    }

    useEffect(() => {
        if (typing&&friendInfo) {
            socket?.current.emit("typing", {
                senderId: loggedInUser._id,
                receiverId: friendInfo._id
            })

            setTimeout(() => {
                socket?.current.emit("typing stop", {
                    senderId: loggedInUser._id,
                    receiverId: friendInfo._id
                })
                setTyping(false);
            }, 2000);
        }
    }, [typing, loggedInUser, friendInfo]);

    // SOCKET.IO 
    // ---------------------------------------
    useEffect(() => {
        console.log("Initialize new socket connection");
        socket.current = io(SOCKET_ENDPOINT);

        //Resiger listers for event from server
        //1.Fetching new message
        socket.current.on("getMessage", (data) => {
            console.log("client socket receive:", data);
            setArrivalMessage({
                sender: data.senderId,
                content: data.content,
                createdAt: Date.now()
            })
        });

        //2.Fetching typing status of the opposite
        socket.current.on("typing", (senderId) => {
            console.log("got typing event from server");
            setTypingData({ senderId, typing: true })
        });

        socket.current.on("typing stop", (senderId) => {
            console.log("got typing event from server");
            setTypingData({ senderId, typing: false })
        });

        return ()=>{
            socket.current.disconnect();
        }
    }, []);

    //Update isTyping state of remote user upon typingData
    useEffect(() => {
        friendInfo && typingData && typingData.senderId === friendInfo._id && setIsTyping(typingData.typing);
    }, [typingData, loggedInUser, friendInfo]);

    useEffect(() => {
        friendInfo && arrivalMessage && (arrivalMessage.sender === friendInfo._id) && dispatch(ALL_MESSAGES_ADD(arrivalMessage));

        arrivalMessage && dispatch(ALL_CHATS_UPDATE(arrivalMessage));
    }, [dispatch, friendInfo, arrivalMessage]);

    useEffect(() => {
        // Register the current local user to websocket server
        socket.current.emit("addUser", loggedInUser._id);

        // Fetch all client info from websocket server
        friendInfo&&socket.current.on("getUsers", users => {
            setIsOnline(users.some((user) => user._id === friendInfo._id));
            setOnlineUsers(users);
        })
    }, [loggedInUser._id, friendInfo])
    // ---------------------------------------------------------
    // SEACH CHAT MODAL
    const handleModalClose=()=>{
        setShowSearch(false);
    }

    const handleModalOpen=()=>{
        setShowSearch(true);
    }

    console.log("friendInfo: ", friendInfo);
    return (
        <div className="bg-white h-[calc(100vh-50px)] mt-[50px] flex flex-row">
            <Sidebar onlineUsers = {onlineUsers} handleModalOpen={handleModalOpen}/>
            {!chatId ?
                <div className="w-2/3 h-full flex flex-col justify-center items-center">
                    <div className="mb-3">{chatIcon}</div>
                    <p className="text-xl mb-3">Your messages</p>
                    <p className="text-gray-400 text-sm mb-4">Send private photos and messages to a friend or group</p>
                    <button className="py-1 px-3 bg-primary-blue rounded-lg font-normal text-white text-base hover:bg-blue-500"
                    onClick={handleModalOpen}>Send message</button>
                </div> :
                friendInfo&&
                <div className="w-2/3 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex flex-row justify-between items-center  border-b px-5 py-4">
                        <div className="flex flex-row items-center">
                            <div className="relative mr-3">
                                <img className="w-11 h-11 rounded-full ojbect-cover" src={sampleAvatar} alt="avatar" />
                                <div className="w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0 z-10 border-2 border-white"></div>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <p className="text-base font-bold">{friendInfo.name}</p>
                                {isOnline && <p className="text-xs text-gray-500"> Active now</p>}
                            </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="cursor-pointer">{audioCallIcon}</div>
                            <div className="cursor-pointer">{videoCallIcon}</div>
                            <div className="cursor-pointer">{infoIcon}</div>
                        </div>
                    </div>
                    {/* Dialogue Display */}
                    <div style={{ flex: "6" }} className="overflow-y-scroll">
                        <div class="flex flex-col items-center py-6">
                            <img class="w-24 h-24 rounded-full mb-3" src={sampleAvatar} alt="avatar" />
                            <p class="text-xl font-semibold">{friendInfo.name}</p>
                            <p class="text-gray-600 text-sm">{friendInfo.username} • Instagram</p>
                            <button class="bg-gray-100 rounded-lg py-1 px-2 mt-6">View profile</button>
                        </div>
                        
                        {
                            loading?
                            <SpinLoader/>:
                            allMessages.map((msg) => 
                            <>
                            <Message
                                isOwnMsg={msg.sender === loggedInUser._id}
                                friendAvatar={friendInfo.avatar}
                                content={msg.content} />
                            <div ref={scrollRef}></div>
                            </>
                            )
                        }

                        {isTyping &&
                            <div className="flex flex-row items-center justify-start gap-3 p-3">
                                <img className="w-7 h-7 rounded-full" src={friendInfo.avatar} alt="avatar" />
                                <p className="text-sm text-gray-500">typing...</p>
                            </div>}
                    </div>
                    {/* Message Composing */}
                    <div style={{ flex: "1" }} className="flex border-t  justify-center items-center py-3 relative">
                        <div className={`flex flex-col w-[95%] border-gray-300 border ${files ? "rounded-3xl" : "rounded-full"}`}>
                            {
                                files && <div>
                                    {files.map((fileName) => <p>{fileName}</p>)}
                                </div>
                            }
                            <div className="flex flex-row items-center space-x-3 px-4 py-3">
                                <div className="cursor-pointer" onClick={() => setShowEmojis(!showEmojis)}>{emojiIcon}</div>

                                {showEmojis &&
                                    <div className="absolute left-6 rounded-lg" style={{ bottom: "80px", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}>
                                        <Picker
                                            data={data}
                                            set="native"
                                            title="emojis"
                                            onEmojiSelect={(e) => setMessage(message + " " + e.native)}
                                        // onClickOutside={()=>setShowEmojis(!showEmojis)}
                                        />
                                    </div>}

                                <textarea type="text"
                                    className="flex-grow border-none bg-none outline-none p-0 resize-none"
                                    placeholder="Message..."
                                    value={message}
                                    onChange={handleTyping}
                                    ref={textareaRef}>
                                </textarea>

                                {message === "" ?
                                    <>
                                        <div className="cursor-pointer">{voiceClipIcon}</div>
                                        <div className="cursor-pointer" onClick={() => fileRef.current.click()}>
                                            {addPhoto}
                                            <input ref={fileRef} className="hidden" type="file" onChange={handleFileUpload} multiple /></div>
                                        <div className="cursor-pointer" onClick={(e) => handleSendMessage(e, '❤️')}>{likeOutline}</div>
                                    </>
                                    : <div className="text-primary-blue font-bold cursor-pointer" onClick={handleSendMessage}>Send</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            <SearchModal open={showSearch} onClose={handleModalClose}/>
        </div>
    )
}

export default Inbox