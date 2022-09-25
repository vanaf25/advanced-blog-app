import {AxiosInstance} from "axios";
import {CreateMarkType, createPostType, ExtendPostType, PostsType, SearchPostDto} from "../types/postTypes";
import { UpdateSuccessType} from "../types/apiTypes";
export const postsApi=(instance:AxiosInstance)=>({
    async getPosts(params?:SearchPostDto){
        const {data}=  await instance.get<void,{data:PostsType}>(`posts`,{params:{
                type:params?.type || "popular",
                page:params?.page || 1,
                    ...params
            }})
        return data
    },
    async getPost(id:string){
        try {
            const {data}=  await instance.get<void,{data:ExtendPostType | null}>(`posts/${id}`)
            return data
        }
        catch (e) {
            return  null
        }
    },
    async updatePost(id:string,body:createPostType){
        try {
           const {data}=await instance.patch<createPostType,{data:UpdateSuccessType}>(`posts/${id}`,body)
            return data
        }
        catch (e) {
            return null
        }
    },
    async likePost(id:number){
        try{
            const {data}=await instance.patch<createPostType,{data:CreateMarkType}>(`posts/${id}/likePost`)
            return data
        }
        catch (e:any) {
        return e.response.data.message
        }
    },
    async disLikePost(id:number){
        try{
            const {data}=await instance.patch<createPostType,{data:CreateMarkType}>(`posts/${id}/dislikePost`)
            return data
        }
        catch (e:any) {
            return e.response.data.message
        }
    },
    async deletePost(id:number){
            const {data}=await instance.delete<number,{data:UpdateSuccessType}>(`posts/${id}`);
            return data
    },
    async deleteMark(postId:number){
        const {data}=await instance.delete<void ,{data:UpdateSuccessType}>(`posts/${postId}/deleteMark`)
        return data
    },
    async createBookmark(postId:number){
        try{
            const {data}=await instance.post<{postId:number},{data:UpdateSuccessType}>(`posts/bookmarks`,{postId})
            return data
        }
        catch (e:any) {
            return e.response.data.message
        }
    },
    async deleteBookmark(postId:number){
        const {data}=await instance.delete<number,{data:UpdateSuccessType}>(`posts/bookmarks/${postId}`)
        return data
    },
    async getBookmarks(page?:number,take?:number){
        const {data}=await instance.get<void,{data:PostsType}>('posts/bookmarks',{
            params:{
                page:page || 1,
                take:take || 4
            }
        })
        return data
    }
})
