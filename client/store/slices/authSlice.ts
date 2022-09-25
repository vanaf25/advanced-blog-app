import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {LoginResultType,SimpleUserType} from "../../types/authTypes";
import {destroyCookie, setCookie} from "nookies";
import {HYDRATE} from "next-redux-wrapper";
const initialState = {
    user:{} as SimpleUserType,
    isAuth:false,
    token:""
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData(state,action:PayloadAction<SimpleUserType>) {
            state.user=action.payload
            state.isAuth=true
        },
        login(state,action:PayloadAction<LoginResultType>){
            setCookie(null, 'accessToken', action.payload.token, {
                maxAge: 30 * 24 * 60 * 60,
            })
            state.user=action.payload.user
            state.isAuth=true
        },
        logOut(state){
            destroyCookie(null,"accessToken")
            state.isAuth=false
            state.user={} as SimpleUserType
            state.token="";
        },
        setToken(state,action:PayloadAction<string>){
            state.token=action.payload
        }
    },
    extraReducers:{
        [HYDRATE]:(state,action:PayloadAction<any>)=>{
            const token=action.payload.auth.token
            if (token){
                state.token=token
            }
            const user=action.payload.auth.user
            if (Object.values(user).length) {
                state.user = user
                state.isAuth=true
            }
        },
    }
})

export const { setUserData,login,logOut,setToken} = authSlice.actions
export default authSlice.reducer
