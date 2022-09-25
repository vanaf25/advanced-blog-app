import React, {memo, useState} from 'react';
import {CommentsType} from "../../types/postTypes";
import Comment from "./Comment/Comment";
import {Card, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {Box} from "@mui/system";
type CommentsProps={
    propsComments:CommentsType,
    isThePostPage?:boolean
}
const Comments:React.FC<CommentsProps>=memo( ({propsComments,isThePostPage}) => {
    const {query}=useRouter();
    const queryParam=query?.id && query?.id[0]
    const idParam=Number(queryParam) ? queryParam:""
    const [orderBy,setOrderBy]=useState(0)
    const typesOfOrderBy=["Popular","New"]
    const comments=propsComments
    return (
        <>
            <Box sx={{display:"flex",mb:1}}>
                {!propsComments && typesOfOrderBy.map((type,index)=><Box onClick={()=>setOrderBy(index)} key={index}
                                                       sx={{borderRadius:"30px/30px",
                                                           padding:"5px 20px",
                                                           backgroundColor:`${orderBy===index ? "#f5f5f5":"transparent" }`,
                                                           cursor:"pointer"}}>
                    {type}
                </Box>)}
            </Box>
            {comments?.total ? comments?.items.map(comment=><Comment key={comment.id} comment={comment} isAnswer={!!propsComments}  />) :
                isThePostPage ? <Typography sx={{textAlign:"center"}}>No comments yet </Typography>:
                <Card sx={{p:2,textAlign:"center"}}>
                {`${idParam ? "This user has":"You have"} not left any comments yet`}
            </Card> }
        </>
    );
});
export default Comments;
