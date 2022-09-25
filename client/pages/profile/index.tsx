import React, {memo} from 'react';
import {useRouter} from "next/router";
import {useAppSelector, wrapper} from "../../store/store";
import {getIsAuth, getUser} from "../../store/selectors/authSelectors";
import Profile from "../../components/Profile/Profile";
import Posts from "../../components/Posts/Posts";
import {getPostsSelector} from "../../store/selectors/postsSelectors";
import {Stack} from "@mui/material";
import {NextPage} from "next";
import {getPosts} from "../../store/thunks/postsThunks";
import {getProfile} from "../../store/thunks/profileThunks";
import {withAuth} from "../../utils/withAuth";
import {Box} from "@mui/system";
// eslint-disable-next-line react/display-name
const ProfilePage:NextPage=memo( () => {
    const {push,pathname}=useRouter();
    const isAuth=useAppSelector(getIsAuth);
    const userId=useAppSelector(getUser)?.id
   if (!isAuth) push("/login");
    const posts=useAppSelector(getPostsSelector);
    return (
        <Box sx={{width:960,margin:"0 auto"}}>
           <Profile/>
           <Stack direction={"row"} justifyContent={"center"}>
               {<Posts authorId={userId} posts={posts}/>}
           </Stack>
        </Box>
    );
});
export const getServerSideProps=withAuth(async (store,ctx)=>{
    const state=store.getState();
    const user=getUser(state);
    const isAuth=getIsAuth(state)
    const dispatch=store.dispatch;
    if (isAuth){
        const id=user.id
        const profile=state.profile.profile
        if (!profile){
          await  dispatch(getProfile(id))
        }
      await  dispatch(getPosts({ctx,searchDto:{authorId:user.id}}))
        return {
            props:{

            }
        }
    }
})
export default ProfilePage;
