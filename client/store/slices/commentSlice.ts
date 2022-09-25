import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    CommentsType,
} from "../../types/postTypes";
import {HYDRATE} from "next-redux-wrapper";
import findComment from "../../utils/FindComment/FindComment";
import indexOf from "../../utils/indexOf/indexOf";
import {
    createComment,
    deleteComment,
    deleteMark,
    disLikeComment, getComments,
    likeComment,
    updateComment
} from "../thunks/commentsThunks";
import {getPost} from "../thunks/postsThunks";
const initialState={
    comments:{
        items:[],
        total:0
    } as CommentsType,
    deletingInProgress:[] as Array<number>,
    itemsInProgress:[] as Array<number>,
    pageSize:10
}
export const commentSlice=createSlice({
    name:"comments",
    initialState,
    reducers:{
        setComments:(state,action:PayloadAction<CommentsType>)=>{
            state.comments=action.payload
        }
    },
    extraReducers:builder => {
        builder.addCase(HYDRATE,(state,action:any)=>{
            const comments=action.payload?.comments?.comments
            if (comments){
                state.comments=comments
            }
        })
        builder.addCase(deleteComment.fulfilled, (state, action) => {
                let comments=findComment(state.comments,action.payload,"items")
            const items=comments?.items
            if (items){
                const  index=indexOf(items,action.payload)
                if (index>=0) items.splice(index,1)
                comments.total-=1
            }

        })
        builder.addCase(deleteComment.pending,(state,action:any)=>{
            state.deletingInProgress.push(action.meta.arg)
        })
        builder.addCase(createComment.fulfilled, (state, action) => {
            console.log(action.payload.parentId)
            let comments=action.payload.parentId ?
                findComment(state.comments,action.payload.parentId,"items",true):state.comments
            const items=comments?.items
            if (items){
                console.log(action.payload);
               items.push(action.payload)
                comments.total+=1
            }
        })
        builder.addCase(likeComment.fulfilled,(state,action)=>{
            const comment=findComment(state.comments,action.payload.id,"comment")
            if (comment){
                comment.rating=action.payload.rating
                comment.isLiked=true
                comment.isDisLiked=false
                comment.marks=action.payload.marks
            }
        })
        builder.addCase(disLikeComment.fulfilled,(state,action)=>{
            const comment=findComment(state.comments,action.payload.id,"comment")
            if (comment){
                comment.rating=action.payload.rating
                comment.isLiked=false
                comment.isDisLiked=true
                comment.marks=action.payload.marks
            }
        })
        builder.addCase(updateComment.fulfilled,(state,action)=>{
            const comment=findComment(state.comments,action.payload.commentId,"comment")
            if (comment) comment.text=action.payload.text
        })
        builder.addCase(deleteMark.fulfilled,(state,action)=>{
         const comment=findComment(state.comments,action.payload.commentId,"comment")
            if (comment){
                const mark=comment.marks.find((mark:any)=>mark.user.id===action.payload.userId)
                comment.rating=mark.type==="like" ? comment.rating-1:comment.rating+1
                comment.isDisLiked=false
                comment.isLiked=false
                comment.marks=comment.marks.filter((mark:any)=>mark.user.id!==action.payload.userId)
            }
        })
        builder.addCase(getComments.fulfilled,(state,action)=>{
            if (action.payload && state.comments){
                state.comments.items=[...state.comments.items,...action.payload.items]
                state.comments.total=state.comments.total=action.payload.total
            }
        })
        builder.addCase(getPost.fulfilled,((state, action) =>{
            if (action?.payload?.comments){
                state.comments=action?.payload?.comments
            }
        } ))
    }
})
export const {setComments} = commentSlice.actions
export default commentSlice.reducer
