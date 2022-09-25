import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/store";
import {getCommentPageSize, getCommentsSelector} from "../../store/selectors/commentsSelectors";
import InfiniteScroll from "react-infinite-scroller";
import {getComments} from "../../store/thunks/commentsThunks";
import {CircularProgress} from "@mui/material";
import Comments from "./Comments";
type CommentsWrapperProps={
    itemId:number,
    itemType:"post" | "user"
}
const CommentsWrapper:React.FC<CommentsWrapperProps> = ({itemId,itemType}) => {
    const comments=useAppSelector(getCommentsSelector)
    const [currentCommentPage,setCurrentCommentPage]=useState(1);
    const pageSize=useAppSelector(getCommentPageSize);
    const pagesCount=Math.ceil(comments?.total/pageSize);
    const dispatch=useAppDispatch();
    return (
        <InfiniteScroll
            pageStart={currentCommentPage}
            loadMore={async ()=>{
                if (pagesCount>currentCommentPage){
                    await dispatch(getComments({
                        itemId,
                        query:{
                            type:itemType,
                            page:currentCommentPage+1
                        }
                    }))
                    setCurrentCommentPage(currentCommentPage+1);
                }

            }}
            hasMore
            loader={<>{pagesCount>currentCommentPage && <CircularProgress />}</>
            }
        >
            {<Comments isThePostPage propsComments={comments}/>}
        </InfiniteScroll>
    );
};

export default CommentsWrapper;
