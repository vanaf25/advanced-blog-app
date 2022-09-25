import type {GetStaticProps, NextPage} from 'next'
import styles from '../../styles/Home.module.css'
import React from "react";
import {GetServerSideProps} from "next";
import Posts from "../../components/Posts/Posts";
import {useAppSelector, wrapper} from "../../store/store";
import {Box} from "@mui/system";
import {getPosts} from "../../store/thunks/postsThunks";
import {withAuth} from "../../utils/withAuth";
const New: NextPage = () => {
    const posts=useAppSelector(state => state.posts.posts)
    return (
        <Box sx={{margin:"0 auto"}} className={styles.posts}>
            {posts && <Posts type={"new"} posts={posts}/>}
        </Box>
    )
}
export const getServerSideProps:GetServerSideProps=withAuth(async (store,ctx)=>{
    const dispatch=store.dispatch
    await  dispatch(getPosts({
        ctx,
        searchDto: {
            type: "new"
        }
    }))
})
export default New
