import { createSlice } from '@reduxjs/toolkit'

export const allMessagesSlice = createSlice({
  name: 'allMessages',
  initialState: {
    loading:false,
    messages:[],
    error:null
  },
  reducers: {
    ALL_MESSAGES_REQUEST: state => {
      state.loading = true;
    },
    ALL_MESSAGES_SUCCESS: (state,action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    ALL_MESSAGES_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ALL_MESSAGES_ADD: (state,action) => {
      console.log("allMessages:",state.messages, action.payload);
      state.messages = [...state.messages, action.payload]
    },
    CLEAR_ERRORS: (state) =>{
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
    ALL_MESSAGES_REQUEST,ALL_MESSAGES_SUCCESS,ALL_MESSAGES_FAIL,ALL_MESSAGES_ADD,CLEAR_ERRORS
 } = allMessagesSlice.actions

export const allMessagesReducer = allMessagesSlice.reducer

export const newMessageSlice = createSlice({
  name:"newMessage",
  initialState:{
    loading:false,
    newMessage:{},
    error:null,
  },
  reducers:{
    NEW_MESSAGE_REQUEST:state=>{
      state.loading = true;
      state.error = null;
    },
    NEW_MESSAGE_SUCCESS: (state,payload)=>{
      console.log("new message data",state.newMessage,payload)
      state.loading = false;
      state.newMessage = payload;
    },
    NEW_MESSAGE_FAIL: (state,payload)=>{
      state.loading = false;
      state.error = payload
    }
  }
})

export const { NEW_MESSAGE_REQUEST, NEW_MESSAGE_SUCCESS, NEW_MESSAGE_FAIL } = newMessageSlice.actions;
export const newMessageReducer = newMessageSlice.reducer;