import {createAsyncThunk} from "@reduxjs/toolkit";
import {Api} from "../../api/api";
import {GetServerSidePropsContext, GetStaticPropsContext, NextPageContext} from "next";
import {SearchPostDto} from "../../types/postTypes";
import {RootState} from "../store";
import {cleanPosts} from "../slices/postsSlice";
import {Context} from "../../types/apiTypes";
export const createBookmark=createAsyncThunk(
    'posts/addBookmarks',
    async (postId:number)=>{
        await Api().posts.createBookmark(postId)
        return postId
    }
)
export const getBookmarks=createAsyncThunk(
    'posts/getBookmarks',
    async ({ctx}:{ctx?:NextPageContext | GetServerSidePropsContext,page?:number})=>{
        return   await Api(ctx).posts.getBookmarks()
    }
)
export const deleteBookmark=createAsyncThunk(
    'posts/deleteBookmark',
    async (postId:number)=>{
        await Api().posts.deleteBookmark(postId)
        return postId
    }
)
export const getPosts=createAsyncThunk(
    'posts/getPosts',
    async ({ctx,searchDto,cleanPost}:{ctx?:Context,
        searchDto?:SearchPostDto,cleanPost?:boolean},{dispatch})=>{
        const result = await Api(ctx).posts.getPosts(searchDto)
        if (cleanPost) dispatch(cleanPosts())
        return result
    }
)
export const getPost=createAsyncThunk(
    'posts/getPost',
    async ({ctx,id}:{id:string,ctx?:NextPageContext |  GetServerSidePropsContext})=>{
        try {
            const post=await Api(ctx).posts.getPost(id)
            if (post) return post
            return null
        }
        catch (e) {

            return null
        }
})
export const likePost=createAsyncThunk(
    'posts/likePost',
    async (postId:number,{getState})=>{
        const result=await Api().posts.likePost(postId)
        // @ts-ignore
        const state:RootState=getState()
        const user=state.auth.user
        return {user,...result}
    }
)
export const disLikePost=createAsyncThunk(
    'posts/disLikePost',
    async (postId:number,{getState})=> {
        const result=await Api().posts.disLikePost(postId)
        // @ts-ignore
        const state:RootState=getState()
        const user=state.auth.user
        return {...result}
    }
)
export const deleteMark=createAsyncThunk(
    'posts/deleteMark',
    async (postId:number,{getState})=>{
        await Api().posts.deleteMark(postId)
        // @ts-ignore
        const state:RootState=getState()
        const user=state.auth.user
        return {postId,userId:user?.id}
    }
)
export const deletePost=createAsyncThunk(
    'posts/deletePost',
    async (postId:number)=>{
            await Api().posts.deletePost(postId)
            return postId
    }
)
