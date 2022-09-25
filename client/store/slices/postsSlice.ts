import {createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {HYDRATE} from "next-redux-wrapper";
import {ExtendPostType, PostsType} from "../../types/postTypes";
import {
    createBookmark,
    deleteBookmark,
    deleteMark, deletePost,
    disLikePost,
    getBookmarks, getPost,
    getPosts,
    likePost
} from "../thunks/postsThunks";
const initialState = {
   posts:{
       items:[],
       total:0
   } as PostsType,
    post:null as ExtendPostType | null,
}
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts(state,action:PayloadAction<PostsType>){
            state.posts=action.payload
        },
        setPost(state,action:PayloadAction<ExtendPostType | null>){
            state.post=action.payload
        },
        deletePost(state,action:PayloadAction<number>){
            if (state.posts){
                state.posts.items=state.posts.items.filter(post=>post.id!==action.payload);
            }
        },
        cleanPosts(state){
            state.posts={
                items:[],
                total:0
            }
        }
    },
    extraReducers: (builder) => {
       builder.addCase(HYDRATE,(state,action:any)=>{
           const postSlice=action.payload.posts
           const posts=postSlice.posts
           const post=postSlice.post
           if (posts){
               state.posts=posts
           }
           if(post){
               state.post=post
           }
       })
        builder.addCase(createBookmark.fulfilled,(state,action)=>{
                const post=state.posts.items.find(post=>post.id===action.payload)
            const onePost=state.post
            if (post) post.isBookmark=true
            if (onePost) onePost.isBookmark=true
        })
        builder.addCase(deleteBookmark.fulfilled,(state,action)=>{
            const post=state.posts.items.find(post=>post.id===action.payload)
            const onePost=state.post
            if (post) post.isBookmark=false
            if (onePost) onePost.isBookmark=false
        })
        builder.addCase(getBookmarks.fulfilled,(state,action)=>{
            if (action.payload){
                state.posts=action.payload
            }
        })
        builder.addCase(getPosts.fulfilled,(state,action)=>{
            if (action.payload){
                state.posts.total=action.payload.total
                state.posts.items=[...state.posts.items,...action.payload.items]
            }
        })
        builder.addCase(likePost.fulfilled,(state,action)=>{
            state.posts.items=state.posts.items.map(post=>{
                if (post.id===action.payload.id){
                    return {...post,isLiked:true,isDisLiked:false,
                        marks:action.payload.marks,
                        rating:action.payload.rating
                      }
                }
                return  post
            })
            if (state.post?.id===action.payload.id && state.post){
                state.post.rating=action.payload.rating
                state.post.marks=action.payload.marks
                state.post.isLiked=true
                state.post.isDisLiked=false
            }
        })
        builder.addCase(disLikePost.fulfilled,(state,action)=> {
            //@ts-ignore
            state.posts.items=state.posts.items.map(post=>{
                if (post.id===action.payload.id) {
                    return {
                        ...post, isLiked: false,isDisLiked:true,
                        marks: action.payload.marks,
                        rating: action.payload.rating
                    }
                }
                return  post
            })
            if (state.post?.id===action.payload.id && state.post){
                state.post.rating=action.payload.rating
                state.post.marks=action.payload.marks
                state.post.isLiked=false
                state.post.isDisLiked=true
            }
        })
        builder.addCase(deleteMark.fulfilled,(state,action)=>{
            state.posts.items=state.posts.items.map(post=>{
                if (post.id===action.payload.postId){
                    const mark=post.marks.find(mark=>mark.user.id===action.payload.userId)
                    return {...post,
                        isDisLiked:false,
                        isLiked:false,
                        marks:
                            post.marks.filter(mark=>mark.user.id!==action.payload.userId),
                        rating:mark?.type==="like" ? post.rating-1:post.rating+1}
                }
                return  post
            })
            if (state.post?.id===action.payload.postId){
                const mark=state.post.marks.find(mark=>mark.user.id===action.payload.userId)
                state.post={...state.post, isDisLiked:false,
                    isLiked:false,
                    marks:
                state.post.marks.filter(mark=>mark.user.id!==action.payload.userId),
                    rating:mark?.type==="like" ? state.post.rating-1:state.post.rating+1}
            }
        })
        builder.addCase(getPost.fulfilled,(state,action )=>{
            state.post=action.payload
        })
        builder.addCase(deletePost.fulfilled,(state,action:PayloadAction<number>)=>{
            state.posts.items=state.posts.items.filter(item=>item.id!==action.payload)
        })
    },
})
export const {setPosts,setPost,cleanPosts} = postsSlice.actions
export default postsSlice.reducer
