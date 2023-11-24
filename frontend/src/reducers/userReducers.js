import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user:{},
    loading:false,
    isAuthenticated: false,
    error:null
  },
  reducers: {
    LOGIN_USER_REQUEST: state => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    REGISTER_USER_REQUEST: state => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    LOAD_USER_REQUEST: state => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    LOGIN_USER_SUCCESS: (state,action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    REGISTER_USER_SUCCESS: (state,action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    LOAD_USER_SUCCESS: (state,action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    LOGOUT_USER_SUCCESS: state => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    LOGIN_USER_FAIL: (state,action)=>{
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    LOGOUT_USER_FAIL: (state,action)=>{
      state.loading = false;
      state.error = action.payload;
    },
    REGISTER_USER_FAIL: (state,action)=>{
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    LOAD_USER_FAIL: (state,action)=>{
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    CLEAR_ERRORS: (state) =>{
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  LOGIN_USER_REQUEST, REGISTER_USER_REQUEST, LOAD_USER_REQUEST,
  LOGIN_USER_SUCCESS,REGISTER_USER_SUCCESS, LOAD_USER_SUCCESS,
  LOGIN_USER_FAIL,REGISTER_USER_FAIL, LOAD_USER_FAIL,
  LOGOUT_USER_SUCCESS,LOGOUT_USER_FAIL,
  CLEAR_ERRORS } = userSlice.actions

export const userReducer = userSlice.reducer


export const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: {
    user:null,
    loading:false,
    error:null
  },
  reducers: {
    USER_DETAILS_REQUEST: state => {
      state.loading = true;
    },
    USER_DETAILS_SUCCESS: (state,action) => {
      state.loading = false;
      state.user = action.payload;
    },
    USER_DETAILS_FAIL: (state,action)=>{
      state.loading = false;
      state.error = action.payload;
    },
    USER_DETAILS_CLEAR_ERROR:(state)=>{
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  USER_DETAILS_REQUEST,
  USER_DETAILS_FAIL,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_CLEAR_ERROR} = userDetailsSlice.actions

export const userDetailsReducer = userDetailsSlice.reducer