import React from 'react';
import Profile from "../../components/Profile/Profile";
import {useAppSelector} from "../../store/store";
import {NextPage} from "next";
import Comments from "../../components/Comments/Comments";
import Posts from "../../components/Posts/Posts";
import {getPostsSelector} from "../../store/selectors/postsSelectors";
import {getCommentsSelector} from "../../store/selectors/commentsSelectors";
import {Stack} from "@mui/material";
import {getProfile} from "../../store/thunks/profileThunks";
import {getComments} from "../../store/thunks/commentsThunks";
import {getPosts} from "../../store/thunks/postsThunks";
import {withAuth} from "../../utils/withAuth";
import {Box} from "@mui/system";
import {getProfileSelector} from "../../store/selectors/profileSelectors";
import NotFound from "../../common/NotFound/NotFound";
interface ProfileUserProps {
    currentPage?:string,
    userId?:number,
    statusCode:404
}
// eslint-disable-next-line react/display-name
const ProfileUser:NextPage<ProfileUserProps> =React.memo( ({currentPage,userId,statusCode}) => {
    const comments=useAppSelector(getCommentsSelector);
    const posts=useAppSelector(getPostsSelector);
    return (
        <>
            {statusCode===404 ? <NotFound centered message={"This user was not founded"}/>:<Box sx={{width:960,margin:"0 auto"}}>
                <Profile/>
                {currentPage==="comments" ?  <Comments propsComments={comments}/> :
                    <Stack direction={"row"} justifyContent={"center"}>
                        <Posts authorId={userId}  posts={posts}/>
                    </Stack> }
            </Box>}
        </>
    );
});
export const getServerSideProps=withAuth(async (store,ctx)=>{
    const state=store.getState();
    const {query:params}=ctx
    if (params?.id){
        let currentPage="posts"
        const profile=state.profile.profile
        const userId=params.id[0]
        const dispatch=store.dispatch
        if (!profile){
            if (+userId && +userId>0){
                await dispatch(getProfile(userId))
                const state=store.getState()
                const profile=getProfileSelector(state)
                if (!profile) {
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
            }

        if (params.id[1]?.includes("comments")){
           await dispatch(getComments({
               ctx,
               itemId:+userId,
               query:{type:"user"}
           }))
            currentPage="comments"
        }
        if (currentPage==="posts"){
        await dispatch(getPosts({ctx,searchDto:{authorId:+userId}}))
        }
        return {
            props:{
            currentPage,
                userId
            }
        }
    }
    return {
        redirect: {
            destination: '/profile',
            permanent: false
        }
    }
})
export default ProfileUser;
