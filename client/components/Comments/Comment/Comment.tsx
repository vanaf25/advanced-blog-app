import React, {memo,} from 'react';
import {Box, Card, CardContent} from "@mui/material";
import {ExtendCommentType} from "../../../types/postTypes";
import {useRouter} from "next/router";
import CommentContent from "./CommentContent/CommentContent";
const Comment:React.FC<{comment:ExtendCommentType, isAnswer?:boolean}>=memo( ({comment,isAnswer}) => {
    const {route}=useRouter();
    const isPostPage=route.includes("posts");
    return (
        <>
            { !isPostPage ?
            <Card sx={{mb:1}}>
                <CardContent sx={{paddingBottom:"10px !important"}}>
                    <CommentContent  {...comment}  />
                </CardContent>
            </Card> : <Box sx={{mb:1,pl:3}}>
                    <CommentContent  isPostPage={true} {...comment}/>
                    </Box>}
        </>
    );
});
export default Comment;
