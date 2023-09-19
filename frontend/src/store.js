import { configureStore } from '@reduxjs/toolkit'
import { userDetailsReducer, userReducer } from './reducers/userReducers'
import { combineReducers } from '@reduxjs/toolkit'
import { allMessagesReducer, newMessageReducer } from './reducers/messageReducers'
import { allChatsReducer, newChatReducer } from './reducers/chatReducers'
import { newPostReducer } from './reducers/postReducers'

const rootReducer = combineReducers({
  user:userReducer,
  userDetails:userDetailsReducer,
  allMessages:allMessagesReducer,
  newMessage:newMessageReducer,
  allChats: allChatsReducer,
  newChat: newChatReducer,
  newPost: newPostReducer
})

export default configureStore({
  reducer: rootReducer
})