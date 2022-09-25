import {RootState} from "../store";
export const getPostsSelector=(state:RootState)=>state.posts.posts;
export const getPostSelector=(state:RootState)=>state.posts.post
