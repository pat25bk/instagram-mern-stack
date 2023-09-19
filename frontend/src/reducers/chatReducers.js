import { createSlice } from '@reduxjs/toolkit'

export const allChatsSlice = createSlice({
  name: 'allChats',
  initialState: {
    loading:false,
    chats:[],
    error:null
  },
  reducers: {
    ALL_CHATS_REQUEST: state => {
      state.loading = true;
    },
    ALL_CHATS_SUCCESS: (state,action) => {
      state.loading = false;
      state.chats = action.payload;
    },
    ALL_CHATS_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ALL_CHATS_ADD: (state, action) => {
      state.chats = [...state.chats, action.payload]
    },
    ALL_CHATS_UPDATE:(state, action)=>{
      state.chats = state.chats.map((chat)=>{
        if(chat.users.some((user)=>user._id===action.payload.sender)){
          if(chat.latestMessage) 
            chat.latestMessage.content = action.payload.content;
          else
            chat.latestMessage = {content:action.payload.content};
        }
        return chat
      })
    },
    CLEAR_ERRORS: (state) =>{
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
    ALL_CHATS_REQUEST,ALL_CHATS_SUCCESS,ALL_CHATS_FAIL,ALL_CHATS_ADD,ALL_CHATS_UPDATE,CLEAR_ERRORS
 } = allChatsSlice.actions

export const allChatsReducer = allChatsSlice.reducer

export const newChatSlice = createSlice({
  name:"newChat",
  initialState:{
    loading:false,
    newChat:"",
    error:null,
  },
  reducers:{
    NEW_CHAT_REQUEST:state=>{
      state.loading = true;
      state.error = null;
    },
    NEW_CHAT_SUCCESS: (state,payload)=>{
      state.loading = false;
      state.newChat = payload.newChat
    },
    NEW_CHAT_FAIL: (state,payload)=>{
      state.loading = false;
      state.error = payload
    }
  }
})

export const { NEW_CHAT_REQUEST, NEW_CHAT_SUCCESS, NEW_CHAT_FAIL } = newChatSlice.actions;
export const newChatReducer = newChatSlice.reducer;