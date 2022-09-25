import React from 'react';
import Profile from "../../components/Profile/Profile";
import {getIsAuth, getUser} from "../../store/selectors/authSelectors";
import {getProfile} from "../../store/thunks/profileThunks";
import {getComments} from "../../store/thunks/commentsThunks";
import {withAuth} from "../../utils/withAuth";
import CommentsWrapper from "../../components/Comments/CommentsWrapper";
import {NextPage} from "next";
type CommentsProps={
    userId:number
}
const Comments:NextPage<CommentsProps> = ({userId}) => {
    return (
        <div>
            <Profile/>
           <CommentsWrapper  itemId={userId} itemType={"user"} />
        </div>
    );
};
export const getServerSideProps=withAuth(async (store,ctx)=>{
    const state=store.getState();
    const user=getUser(state);
    const isAuth=getIsAuth(state)
    const dispatch=store.dispatch
    if (isAuth){
        const id=user.id
        const profile=state.profile.profile
        if (!profile){
          await dispatch(getProfile(id))
        }
        await dispatch(getComments({
            itemId:id,
            ctx,
            query:{
                type:"user"
            }
        }))
        return {
            props:{
                userId:id
            }
        }
    }
    return {
        redirect: {
            destination: '/login',
            permanent: false
        }
    }
})
export default Comments;

