import {
    buildCreateApi,
    coreModule,
    fetchBaseQuery,
    reactHooksModule
} from "@reduxjs/toolkit/dist/query/react";
import {prepareHeaders} from "./createHeaders";
import {createPostType, ExtendPostType, PostType} from "../../types/postTypes";
import {HYDRATE} from "next-redux-wrapper";
const createApi = buildCreateApi(
    coreModule(),
    reactHooksModule({ unstable__sideEffectsInRender: true })
)
export const postsApi=createApi({
        reducerPath: "postsApi",
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
        baseQuery: fetchBaseQuery({
            baseUrl: `http://localhost:5000/posts`,
                prepareHeaders(headers,api){
                  return  prepareHeaders(headers,api)
                },
            },
            ),
        endpoints:(build)=>({
            post:build.mutation<PostType,createPostType>({
                query:(body)=>{
                    console.log('b',body)
                    return {body,
                        method:"POST",
                        url:"",}
                }
            }),
            getPost:build.query<ExtendPostType,string>({
                query:(id)=>`/${id}`
            })
        })
    }
)
export const {usePostMutation}=postsApi
