import React, {useState} from 'react';
import Link from "next/link";
import {Button, Collapse, Stack, Typography} from "@mui/material";
import {Box} from "@mui/system";
import Author from "../../../Post/Author/Author";
import {ExtendCommentType} from "../../../../types/postTypes";
import {useAppDispatch, useAppSelector} from "../../../../store/store";
import PopoverComponent from "../../../../common/Popover/Popover";
import CommentForm from "../../CommentForm/CommentForm";
import {getIsAuth} from "../../../../store/selectors/authSelectors";
import {AlertSeverity, setErrorText} from '../../../../store/slices/errorSlice';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import Comments from "../../Comments";
import MarksComponent from "../../../../common/MarksComponent/MarksComponent";
import {deleteMark, disLikeComment, likeComment} from "../../../../store/thunks/commentsThunks";
const CommentContent:React.FC<ExtendCommentType & {isPostPage?:boolean}> = (
    {user,post,text,
        createdAt,isPostPage,id
        ,rating,isLiked,answers,marks,isDisLiked}) => {
    const userId=useAppSelector(state=>state.auth.user)?.id;
    const [isAnswerMode,setIsAnswerMode]=useState(false);
    const [isOpenedAnsweredComments,setIsOpenedAnsweredComments]=useState(false);
    const [isEditMode,setIsEditMode]=useState(false);
    const enableAnswerModeHandle=()=>{
        if(isAuth) setIsAnswerMode(true)
    }
    const dispatch=useAppDispatch();
    const isAuth=useAppSelector(getIsAuth);
   const likeCommentHandle=()=>{
       if (isAuth){
           if (userId!==user.id){
               if (!isLiked){
                   dispatch(likeComment(id));
               }
               else{
                   dispatch(deleteMark(id))
               }
           }
           else dispatch(setErrorText(
               {severity:AlertSeverity.Error, alertText:"User can't like himself",
                   isOpen:true
               }))
       }
   }
   const disLikeCommentHandle=()=>{
           if (isAuth){
               if (userId!==user.id){
                   if (!isDisLiked){
                       dispatch(disLikeComment(id))
                   }
                   else {
                       dispatch(deleteMark(id));
                   }
               }
               else dispatch(setErrorText({severity:AlertSeverity.Error,
                   alertText:"User can't disLike himself",isOpen:true}))
           }
   }
    return (
        <>
            {!isPostPage &&  <Link href={`/posts/${post.id}`}>
                <a>
                    <Typography  sx={{mb:1,fontWeight:700}} variant={"h6"}>
                        {post.title}
                    </Typography>
                </a>
            </Link>}
            <Stack direction={"row"} alignItems={"center"}
                   justifyContent={"space-between"}
                   sx={{mb:1}}>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Author author={user}/>
                    <Box>
                        {new Date(createdAt).toLocaleDateString()}
                    </Box>
                </Stack>
                <Stack direction={"row"}>
                      <MarksComponent rating={rating} marks={marks}
                                  likeItemHandle={likeCommentHandle}
                                  disLikeItemHandle={disLikeCommentHandle}
                                  isLiked={isLiked} isDisLiked={isDisLiked}/>
                </Stack>
            </Stack>
            <Typography>
                {text}
            </Typography>
            <Stack direction={"row"} alignItems={"center"}>
                <Button onClick={enableAnswerModeHandle} sx={{cursor:"pointer"}}>
                    { isAuth ? "Answer":  <Link href={"/login"}>
                        <a>Answer</a>
                  </Link>}
                </Button>
                {answers?.total ?   <Button onClick={()=>setIsOpenedAnsweredComments(prevState => !prevState)}
                                            style={{color:"#1976d2",cursor:"pointer",display:"flex",alignItems:"center"}}>
                   <span style={{marginRight:5}}>{answers.total} Answers</span>
                    {isOpenedAnsweredComments ? <ArrowUpwardOutlinedIcon style={{fontSize:19}}/>:<ArrowDownwardOutlinedIcon style={{fontSize:19}}/>} </Button>:""}
                {userId===user.id && <PopoverComponent
                    toggleEditMode={()=>setIsEditMode(prevState =>!prevState )}
                    type={"comment"} itemId={id}/>}
            </Stack>
            {isAnswerMode && <CommentForm excludeAnswerMode={()=>setIsAnswerMode(false)}
                                          placeholder={"Write a answer"} postId={post.id} parentId={id} /> }
            {isEditMode && <CommentForm type={"edit"} commentId={id}
                                        excludeAnswerMode={()=>setIsEditMode(false)}
                                        defaultInputValue={text} placeholder={"Edit comment"}
                                         /> }

            {answers?.total ? <Collapse in={isOpenedAnsweredComments}>
                <Comments propsComments={answers}/>
            </Collapse>:""}
        </>
    );
};
export default CommentContent;
