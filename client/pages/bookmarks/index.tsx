import React from 'react';
import {GetServerSideProps, NextPage} from "next";
import {useAppSelector, wrapper} from "../../store/store";
import Posts from "../../components/Posts/Posts";
import {Box} from "@mui/system";
import {Button, Paper, Stack} from "@mui/material";
import styles from '../../styles/Home.module.css'
import {getPosts} from "../../store/thunks/postsThunks";
import {withAuth} from "../../utils/withAuth";
const Bookmarks:NextPage = () => {
    const bookmarks=useAppSelector(state => state.posts.posts)
    return (
        <Box className={styles.posts} sx={{margin:"0 auto"}}>
            {bookmarks.total ?   <Posts isBookmarks posts={bookmarks}/>:
                    <Paper
                        sx={{
                            margin:"0 auto",
                            maxWidth:"max-content",
                            p:6}} >
                        You don't have  any bookmarks
                    </Paper>
                }
        </Box>
    );
};
export const getServerSideProps:GetServerSideProps=withAuth(async (store,ctx)=>{
    const dispatch=store.dispatch
    const state=store.getState()
    const isAuth=state.auth.isAuth
    if (!isAuth) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
   await dispatch(getPosts({ctx, searchDto: {isBookmarks: true}}))
})

export default Bookmarks;
