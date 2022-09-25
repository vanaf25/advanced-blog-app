import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import WriteForm from "../../components/WriteForm";
import {withAuth} from "../../utils/withAuth";
import {getPost} from "../../store/thunks/postsThunks";
import {getPostSelector} from "../../store/selectors/postsSelectors";
import {useAppSelector} from "../../store/store";

interface WritePageProps {
  post: any;
}

const WritePage: NextPage<WritePageProps> = () => {
  const post=useAppSelector(getPostSelector)
  return (
      <WriteForm type={"update"} titleDefaultValue={post.title} defaultTags={post.tags} defaultBlocks={post.body}  />
  );
};
export const getServerSideProps=withAuth(async (store,ctx)=>{
const  id=ctx.query?.id
  if (id && +id && typeof id==="string"){
    const dispatch=store.dispatch;
    await dispatch(getPost({id,ctx}))
    const post=getPostSelector(store.getState());
  }
})
export default WritePage;
