import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {HYDRATE} from "next-redux-wrapper";
import {ExtendUserType} from "../../types/users";
import {Api} from "../../api/api";
import {SearchUserDto} from "../../types/profileTypes";
import {getProfile, getUsers, updateUserImage} from "../thunks/profileThunks";
const initialState = {
    profile: null as unknown as ExtendUserType,
    users:[] as ExtendUserType[],
    totalUserCount:0,
}
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileData(state,action:PayloadAction<ExtendUserType>) {
            state.profile=action.payload
        },
        cleanUsers(state) {
            state.users=[]
            state.totalUserCount=0
        }
    },
    extraReducers:builder =>{
        builder.addCase(HYDRATE,(state,action:any)=>{
            const profile=action.payload.profile.profile
            const users=action.payload.profile.users
            const totalCount=action.payload.profile.totalUserCount
            if (profile) state.profile=profile
            if (users) state.users=users
            if (totalCount) state.totalUserCount=totalCount
        })
        builder.addCase(getUsers.fulfilled,(state,action)=>{
            state.users=[...state.users, ...action.payload.items]
            state.totalUserCount=action.payload.total
        })
        builder.addCase(getProfile.fulfilled,(state,action)=>{
            // @ts-ignore
            state.profile=action.payload
        })
        builder.addCase(updateUserImage.fulfilled,(state,action)=>{
            if (state.profile)   state.profile.headerImage=action.payload
        })
    }
})
export const {setProfileData,cleanUsers} = profileSlice.actions
export default profileSlice.reducer
