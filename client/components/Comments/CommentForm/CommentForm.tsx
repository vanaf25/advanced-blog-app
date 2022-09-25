import React, {useState} from 'react';
import {Button, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {Box} from "@mui/system";
import {getIsAuth} from "../../../store/selectors/authSelectors";
import Link from "next/link";
import {createComment, updateComment} from "../../../store/thunks/commentsThunks";
type CommentFormProps={
    postId?:number,
    parentId?:number,
    placeholder?:string,
    excludeAnswerMode?:()=>void,
    defaultInputValue?:string,
    type?:"create" | "edit",
    commentId?:number
}
const CommentForm:React.FC<CommentFormProps> = ({type,postId,parentId,
                                                    placeholder,excludeAnswerMode
                                                    ,defaultInputValue,commentId}) => {
    const [commentValue,setCommentValue]=useState(defaultInputValue || "");
    const [isUpdating,setIsUpdating]=useState(false);
    const dispatch=useAppDispatch()
    const createCommentHandle=async ()=>{
        if (type==="create" || !type){
            if (commentValue && postId){
                setIsUpdating(true)
               await dispatch(createComment({text:commentValue,postId,parentId}))
                setCommentValue("")
                setIsUpdating(false)
                if(excludeAnswerMode){
                    excludeAnswerMode()
                }
            }
        }
        else{
            if (commentValue && commentId){
                setIsUpdating(true)
                await dispatch(updateComment({commentId,text:commentValue}))
                setIsUpdating(false)
                if(excludeAnswerMode){
                    excludeAnswerMode()
                }
            }
        }
    }
    const isAuth=useAppSelector(getIsAuth);
    return (
        <Box sx={{mb:1}}>
            <TextField
                margin="normal"
                fullWidth
                id="outlined-textarea"
                label={placeholder}
                placeholder={placeholder}
                multiline
                value={commentValue}
                onChange={e=>setCommentValue(e.target.value)}
            />
            {parentId || commentId  ?
                <Button disabled={isUpdating} onClick={excludeAnswerMode} sx={{mr:1}} variant={"outlined"}>Cancel</Button>:""}

            {isAuth ?   <Button
                onClick={createCommentHandle}
                disabled={!commentValue || isUpdating}  variant={"contained"}>{
                isUpdating ?  type==="edit" ? "Updating":"Sending":"Send"}</Button>:
                <Link href={"/login"}>
                    <a>
                        <Button variant={"contained"}>
                            Send
                        </Button>
                    </a>
                </Link>
            }
        </Box>
    );
};
export default CommentForm;
