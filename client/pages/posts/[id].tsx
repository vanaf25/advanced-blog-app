import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/store";
import {GetServerSideProps, NextPage} from "next";
import {Box, Card, CircularProgress, Stack, Typography} from "@mui/material";
import parse from 'react-html-parser'
import {OutputBlockData,} from "@editorjs/editorjs";
import Comments from "../../components/Comments/Comments";
import CommentForm from "../../components/Comments/CommentForm/CommentForm";
import CardHeader from "../../common/CardHeader/CardHeader";
import PostFooter from "../../components/Post/PostFooter/PostFooter";
import InfiniteScroll from 'react-infinite-scroller';
import {getComments} from "../../store/thunks/commentsThunks";
import {getPost} from "../../store/thunks/postsThunks";
import {withAuth} from "../../utils/withAuth";
import {parseBlock} from "../../utils/Post/parsePostBody";
import {getCommentPageSize, getCommentsSelector} from "../../store/selectors/commentsSelectors";
import {getPostSelector} from "../../store/selectors/postsSelectors";
import CommentsWrapper from "../../components/Comments/CommentsWrapper";
import {getIsAuth} from "../../store/selectors/authSelectors";
import NotFound from "../../common/NotFound/NotFound";
interface PostProps {
    statusCode?:number,
}
const Post:NextPage<PostProps> = ({statusCode}) => {
    const post=useAppSelector(getPostSelector)
    return (
        <>
            {statusCode===404 ? <NotFound centered message={`Sorry, but post was not finded`} />: post &&
                <Box sx={{width:800,margin:"0 auto"}} >
                <Card sx={{p:2,mb:2}} variant={"outlined"}>
                    <CardHeader itemId={post.id} createdAt={post.createdAt} author={post.author} />
                    <h1>
                        {post.title}
                    </h1>
                    <Box sx={{mb:2}}>
                        {post.body.map(block=><React.Fragment key={Math.random()}>{parseBlock(block)}</React.Fragment>)}
                    </Box>
                    <PostFooter countOfComments={post.countOfComments}
                                countOfRePosts={post.countOfRePosts}
                                tags={post.tags} isBookmark={post.isBookmark}
                                marks={post.marks}
                                postViews={post.views}
                                rating={post.rating}
                                authorId={post.author.id}
                                isLiked={post.isLiked}
                                isDisLiked={post.isDisLiked}
                                postId={post.id} postTitle={post.title} />
                </Card>
                    <Card sx={{p:2}} variant="outlined">
                        <Typography sx={{mb:1}} variant={"h4"}>{post.countOfComments} Comments</Typography>
                        <CommentForm postId={post.id}/>
                      <CommentsWrapper itemId={post.id} itemType={"post"}/>
                    </Card>
                </Box>
            }
        </>
    );
};
export const getServerSideProps:GetServerSideProps=withAuth(async (store,ctx)=>{
    const id=ctx.query?.id
    if (id && typeof id==="string" && +id>0 && +id){
        const dispatch=store.dispatch;
        await dispatch(getPost({id,ctx}))
        const post=getPostSelector(store.getState());
        if (!post){
            ctx.res.statusCode=404
            return  {
                props:{
                    statusCode:404
                }
            }
        }
    }
    else {
        ctx.res.statusCode=404
        return  {
            props:{
                statusCode:404
            }
        }
    }

})
export default Post;
