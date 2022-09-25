import {AxiosInstance} from "axios";
import {
    CommentsType,
    CommentType,
    createCommentDto,
    CreateMarkType,
    SearchCommentDto,
    UpdateCommentDto
} from "../types/postTypes";
import {DataType, UpdateSuccessType} from "../types/apiTypes";
export const commentsApi=(instance:AxiosInstance)=>({
   async createComment(body:createCommentDto){
    const {data}=await instance.post<createCommentDto,DataType<CommentType>>(`comments`,body)
       return data
   },
   async updateComment(dto:UpdateCommentDto){
       try {
           const {data}=await instance.patch<createCommentDto,DataType<UpdateSuccessType>>(`comments/${dto.commentId}`,{text:dto.text})
           return data
       }
       catch (e) {
           console.log('e',e)
       }
   },
    async deleteComment(commentId:number){
        const {data}=await instance.delete<number,DataType<UpdateSuccessType>>(`comments/${commentId}`)
        return data
    },
    async likeComment(commentId:number){
           const {data}=await instance.patch<number,DataType<CreateMarkType>>(`comments/${commentId}/likeComment`)
           return data
    },
    async disLikeComment(commentId:number){
        const {data}=await instance.patch<number,DataType<CreateMarkType>>(`comments/${commentId}/disLikeComment`)
        return data
    },
    async deleteMark(commentId:number){
        const {data}=await instance.delete<number,DataType<UpdateSuccessType>>(`comments/${commentId}/deleteMark`)
        return data
    },
    async getComments(itemId:number,query:SearchCommentDto){
        const {data}=await instance.get<void,DataType<CommentsType>>(`comments/${itemId}`,{
            params:query
        })
        return data
    }
})
