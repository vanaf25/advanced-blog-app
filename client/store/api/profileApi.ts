import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import createHeaders, {prepareHeaders} from "./createHeaders";
import {UpdateProfileDto} from "../../types/profileTypes";
import {ItemsType, UpdateSuccessType} from "../../types/apiTypes";
import {CommentsType, PostsType} from "../../types/postTypes";
export const profileApi=createApi({
        reducerPath: "profileApi",
        baseQuery: fetchBaseQuery({baseUrl: `http://localhost:5000/users/`,  prepareHeaders(headers, store){
                return prepareHeaders(headers,store)
            },}),
        endpoints:(build)=>({
        profile:build.query<any,string | number>({
            query:(id)=>`${id}`,
        }),
            userComments:build.query<ItemsType<CommentsType>,number>({
                query:(id)=>`comments/${id}`
            }),
            userPosts:build.query<ItemsType<PostsType>,number>({
               query:(id)=>`posts/${id}`
            }),
            updateProfile:build.mutation<UpdateSuccessType,UpdateProfileDto>({
                query:(body)=>{
                    console.log('body',body);
                    const formData=new FormData()
                    formData.append("logo",body.logo as any)
                    formData.append("description",body.description as any)
                    formData.append("fullName",body.fullName as any)
                    formData.append("email",body.email as any)
                    return {
                    method:"PATCH",
                    body:formData,
                        headers:{
                           /* 'Content-Type': 'multipart/form-data',*/
                        },
                    url:""}
                },
                async onQueryStarted(_,{dispatch,queryFulfilled}){
                    try {
                        const response=await queryFulfilled
                        if(response.data){
                            console.log(response.data);
                        }
                    }
                    catch (e) {

                    }
                }
            })
            })
    }
)
export const {useProfileQuery,useUserCommentsQuery,useUpdateProfileMutation,useUserPostsQuery}=profileApi
