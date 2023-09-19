import { createSlice } from '@reduxjs/toolkit'

export const newPostSlice = createSlice({
    name:"newPost",
    initialState:{
      loading:false,
      newPost:"",
      error:null,
      success:false
    },
    reducers:{
      NEW_POST_REQUEST:state=>{
        state.loading = true;
        state.error = null;
      },
      NEW_POST_SUCCESS: (state,action)=>{
        state.loading = false;
        state.newPost = action.payload;
        state.success = true;
      },
      NEW_POST_FAIL: (state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      },
      NEW_POST_RESET:(state)=>{
        state.success = false;
      },
      NEW_POST_CLEAR_ERROR:(state)=>{
        state.error = null;
      }
    }
  })
  
  export const { NEW_POST_REQUEST, NEW_POST_SUCCESS, NEW_POST_FAIL,NEW_POST_CLEAR_ERROR,NEW_POST_RESET} = newPostSlice.actions;
  export const newPostReducer = newPostSlice.reducer;