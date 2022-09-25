import type { NextPage } from 'next'
import React from "react";
import {GetServerSideProps} from "next";
import {useAppSelector} from "../store/store";
import Posts from "../components/Posts/Posts";
import {Box} from "@mui/system";
import styles from '../styles/Home.module.css'
import {getPosts} from "../store/thunks/postsThunks";
import {withAuth} from "../utils/withAuth";
const Home: NextPage = () => {
    const posts=useAppSelector(state => state.posts.posts)
    return (
        <Box className={styles.posts} sx={{margin:"0 auto"}}>
            { <Posts posts={posts}/>}
        </Box>
    )
}
export const getServerSideProps:GetServerSideProps=withAuth(async (store:any,ctx:any)=>{
    await    store.dispatch(getPosts({
        ctx
    }))
})
export default Home

