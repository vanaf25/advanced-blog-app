import {RootState} from "../store";
export const getCommentsSelector=(state:RootState)=>state.comments.comments;
export const getCommentPageSize=(state:RootState)=>state.comments.pageSize
