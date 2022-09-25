import React, {useEffect, useRef, useState} from 'react';
import {PostsType, SearchPostDto} from "../../types/postTypes";
import {Box, Card, CircularProgress, Stack} from "@mui/material";
import Post from "../Post/Post";
import {useRouter} from "next/router";
import styles from "../../styles/Home.module.css";
import {useAppDispatch} from "../../store/store";
import {getPosts} from "../../store/thunks/postsThunks";
import InfiniteScroll from 'react-infinite-scroller';
import {getComments} from "../../store/thunks/commentsThunks";
type PostsProps={
    posts:PostsType,
    isBookmarks?:boolean,
    authorId?:number,
    type?:"new" | "popular"
}
const   PAGE_SIZE=4
const Posts:React.FC<PostsProps> = ({posts,isBookmarks,authorId,type}) => {
    const {query}=useRouter();
    const [currentPage,setCurrentPage]=useState(1);
    const [isLoading,setIsLoading]=useState(false)
    const pagesCount=Math.ceil(posts?.total/PAGE_SIZE)
    const dispatch=useAppDispatch();
    const router=useRouter()
    const queryParam=query?.id && query?.id[0]
    const idParam=Number(queryParam) ? queryParam:""
   /* const fetchPostsHandle=async ()=>{
        await dispatch(getPosts({searchDto:{
                isBookmarks,
                authorId,
                page:currentPage+1,
                type,
            }}))
        setIsLoading(false);
        setCurrentPage(prevState => ++prevState)
    }
    useEffect( ()=>{
        if (isLoading && currentPage<pagesCount){
            fetchPostsHandle()
        }
        else setIsLoading(false);
    },[isLoading])*/
  /*  useEffect(()=>{
        document.addEventListener("scroll",scrollHandler)
        return ()=>{
            document.removeEventListener("scroll",scrollHandler);
        }
    },[])
    const scrollHandler=async (e:any)=>{
        if (typeof window!=="undefined"){
            if (e.target.documentElement.scrollHeight-(e.target.documentElement.scrollTop+window.innerHeight)<100){
                if (currentPage<pagesCount){
                    setIsLoading(true);
                }
            }
        }
    }*/

    return (
        <Box    className={styles.posts}>
            {posts?.total ? <InfiniteScroll
                loader={<>{pagesCount>currentPage && <CircularProgress />}</>}
                pageStart={currentPage}
                hasMore
                loadMore={async ()=>{
                    if (pagesCount>currentPage && !isLoading){
                        setIsLoading(true)
                        await dispatch(getPosts({searchDto:{
                                isBookmarks,
                                authorId,
                                page:currentPage+1,
                                type,
                            }}))
                        setIsLoading(false);
                        setCurrentPage(prevState => ++prevState)
                    }
                }}

            >
                {posts?.items.map(post=><Post key={post.id} post={post}/>)}
            </InfiniteScroll>  :<Card sx={{p:2,textAlign:"center"}}>
                {`${idParam ? "This user has":"You have"} not left any posts yet`}
            </Card> }
        </Box>
    );
};

export default Posts;
