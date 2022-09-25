import {createAsyncThunk} from "@reduxjs/toolkit";
import {Api} from "../../api/api";
import {createCommentDto, SearchCommentDto, UpdateCommentDto} from "../../types/postTypes";
import {RootState} from "../store";
import {GetServerSidePropsContext, NextPageContext} from "next";
import {getUser} from "../selectors/authSelectors";

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId: number) =>{
        await Api().comments.deleteComment(commentId)
        return commentId
    }
)
export const createComment=createAsyncThunk(
    'comments/createComment',
    async (body:createCommentDto)=>await Api().comments.createComment(body)
)
export const likeComment=createAsyncThunk(
    'comments/likePost',
    async (commentId:number,{getState}:any)=>{
        const result=await Api().comments.likeComment(commentId)
        // @ts-ignore
        const state:RootState=getState()
        const user=getUser(state)
        return   {user,...result}
    }
)
export const disLikeComment=createAsyncThunk(
    'comments/disLikeComment',
    async (commentId:number,{getState}:any)=>{
        const result=await Api().comments.disLikeComment(commentId)
        // @ts-ignore
        const state:RootState=getState()
        const user=getUser(state);
        return  {user,...result}
    }
)
export const updateComment=createAsyncThunk(
    'comments/updateComment',
    async (dto:UpdateCommentDto)=>{
        await Api().comments.updateComment(dto)
        return dto
    }
)
export const deleteMark=createAsyncThunk(
    'comments/deleteMark',
    async (commentId:number,{getState})=>{
        await Api().comments.deleteMark(commentId)
        // @ts-ignore
        const state:RootState=getState()
        const userId=state.auth.user?.id
        return  {commentId,userId}
    }
)
export const getComments=createAsyncThunk(
    'comments/getComments',
    async ({ctx,itemId,query}
               :{ctx?:NextPageContext | GetServerSidePropsContext,
        itemId:number,
        query:SearchCommentDto})=>await Api(ctx).comments.getComments(itemId,query)
)
