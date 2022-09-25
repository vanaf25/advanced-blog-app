import {createAsyncThunk} from "@reduxjs/toolkit";
import {Api} from "../../api/api";
import {SearchUserDto} from "../../types/profileTypes";
import {cleanUsers} from "../slices/profileSlice";
export const getProfile=createAsyncThunk(
    "profile/getProfile",
    async (id:number | string)=>await Api().profile.profile(id)
)
export const getUsers=createAsyncThunk(
    'profile/users',
    async (query:SearchUserDto,{dispatch})=>{
        const result= await Api().profile.getUsers(query)
        if (query.isCleanUsers) dispatch(cleanUsers())
        return result
    }
)
export const updateUserImage=createAsyncThunk(
    "profile/updateImage",
    async (body:{image:File})=>{
   return  await Api().profile.updateHeaderImage(body)
    }
)
