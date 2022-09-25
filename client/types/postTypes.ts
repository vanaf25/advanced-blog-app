import {SimpleUserType} from "./authTypes";
import {ItemsType} from "./apiTypes";
import {OutputBlockData, OutputData} from "@editorjs/editorjs";
import {PostViewsEnum} from "../../server/src/post/dto/search-post.dto";
export type PostType={
    title:string,
    id:number,
    body:OutputData["blocks"],
    createdAt:string,
    updatedAt:string,
    views:number,
    author:SimpleUserType,
    tags: Array<string>,
    description:string,
    firstImage:OutputBlockData | null,
    rating:number,
    isBookmark:boolean,
    isLiked:boolean,
    isDisLiked:boolean,
    marks:MarkType[],
    countOfRePosts:number,
    countOfComments:number
}
export type CreateMarkType={
    id:number,
    marks:MarkType[],
    rating:null
}
export type PostsType=ItemsType<Array<PostType>>
export type MarkType={
    id:number,
    type:'like' | 'dislike',
    user:SimpleUserType
}
export type CommentType={
id:number,
    text:string,
    createdAt:string,
    updatedAt:string,
    user:SimpleUserType,
    rating:number,
    answers:CommentsType,
    parentId:number | null,
    marks:MarkType[],
    isLiked:boolean,
    isDisLiked:boolean
}
export type ExtendCommentType=CommentType & {post:{id:number,title:string}}
export type CommentsType=ItemsType<Array<ExtendCommentType>>
export type ExtendPostType={comments:CommentsType} & PostType;
export type createPostType={
    body:any,
    title:string,
    tags:Array<string>
}
export type createCommentDto={
    text:string,
    postId:number,
    parentId?:number
}
export type UpdateCommentDto={
    text:string,
    commentId:number
}
export type SearchPostDto={
    query?:string | string[]
    views?:PostViewsEnum
    ratingFrom?:number
    ratingTo?:number
    page?:number
    take?:number
    tags?:string[]
    type?:"popular" | "new"
    authorId?:number
    searchOnlyForDescription?:boolean
    searchForTitleAndDescription?:boolean
    isBookmarks?:boolean
}
export type BookmarksSearchDto={
 page?:number,
 take?:number
}
export type SearchCommentDto={
    take?:number
    page?:number
    orderBy?:"popular" | "new"
    parentId?:number,
    type:'post' | "user"
}
