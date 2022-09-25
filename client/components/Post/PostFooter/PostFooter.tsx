import React, {useState} from 'react';
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {getIsAuth, getUser} from "../../../store/selectors/authSelectors";
import {MarkType} from "../../../types/postTypes";
import {AlertSeverity, setErrorText} from '../../../store/slices/errorSlice';
import MarksComponent from "../../../common/MarksComponent/MarksComponent";
import {createBookmark, deleteBookmark, deleteMark, disLikePost, likePost} from "../../../store/thunks/postsThunks";
import {Checkbox, Stack, Typography} from "@mui/material";
import {useRouter} from "next/router";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MousePopover from '../../../common/MousePopover/MousePopover';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import {
    EmailIcon, EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon, TwitterShareButton,
} from 'react-share';
import styles from '../Post.module.scss'
import {Box} from "@mui/system";
import Tags from "../../../common/Tags/Tags";
type PostFooterProps={
    postViews:number
    rating:number,
    authorId:number,
    postId:number,
    isBookmark:boolean,
    marks:MarkType[],
    isLiked:boolean,
    isDisLiked:boolean,
    tags:string[],
    postTitle:string,
    countOfRePosts:number,
    countOfComments:number
}
const CLIENT_URL=`http://localhost:3000`
const PostFooter:React.FC<PostFooterProps> = (
    {postViews, rating,authorId,postId,
        isBookmark, marks,isDisLiked,isLiked,postTitle
        ,tags,countOfRePosts,countOfComments
                                              }) => {
    const userId=useAppSelector(getUser)?.id
    const isAuth=useAppSelector(getIsAuth);
    const dispatch=useAppDispatch();
    const likePostHandle= async ()=>{
        if (userId!==authorId){
            if (!isLiked){
                await  dispatch(likePost(postId))
            }
           else {
             await dispatch(deleteMark(postId))
           }
        }
        else {
            dispatch(setErrorText({alertText:"User can't disLike Himself",
                severity:AlertSeverity.Error}))
        }
    }
    const disLikePostHandle=async ()=>{
        if (userId!==authorId){
            if (!isDisLiked){
                  dispatch(disLikePost(postId))
            }
            else {
                await dispatch(deleteMark(postId))
            }

        }
        else {
            dispatch(setErrorText({alertText:"User can't disLike Himself",severity:AlertSeverity.Error}))
        }
    }
    const router=useRouter();
    const [isBookmarkFetching,setIsBookmarkFetching]=useState(false)
    const onBookmarkChange=async ()=>{
        if (isAuth){
            setIsBookmarkFetching(true)
           if (isBookmark) await dispatch(deleteBookmark(postId))
           else  await dispatch(createBookmark(postId))
            setIsBookmarkFetching(false);
        }
        else  router.push("/login")
    }
    const shareActions=[{
        Icon:TwitterIcon,
        text:"Twitter",
        Button:TwitterShareButton
    },
        {
            Icon:TelegramIcon,
            text:"Telegram",
            Button:TelegramShareButton
        },
        {Icon:EmailIcon,text:"Send to e-mail",Button:EmailShareButton},
/*
        {Icon:ContentCopyOutlinedIcon,text:"Copy the link"}
*/
    ]
    return (
        <Box>
            <Tags tags={tags}/>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack spacing={3} direction={"row"}>
                    <Stack direction={"row"} alignItems={"center"}>
                        <RemoveRedEyeOutlinedIcon  sx={{mr:0.5}}/>
                        <span>{postViews}</span>
                    </Stack>
                    <Checkbox
                        disabled={isBookmarkFetching}
                        onChange={onBookmarkChange}  sx={{padding:0}} icon={<BookmarkBorderOutlinedIcon/>}
                        checked={isBookmark}
                        className={styles.popover__elem}
                        checkedIcon={<BookmarkOutlinedIcon />}/>
                    <MousePopover>
                        <Stack spacing={1}>
                            {shareActions.map(({Icon,text,Button},index)=> <Button
                                    url={`${CLIENT_URL}/posts/${postId}`}
                                    subject={postTitle} quote={postTitle}
                                    title={postTitle}
                                    description={postTitle}
                                >
                                    <Stack key={index}
                                           className={styles.shareIcons}
                                           title={"share"}
                                           direction={"row"} spacing={1}   alignItems={"center"}>
                                        <Icon size={32} round/>
                                        <Typography>{text}</Typography>
                                    </Stack>
                                </Button>
                            )}
                        </Stack>
                    </MousePopover>
                    <Stack  direction={"row"} spacing={1} >
                        <Box title={"Make a re post"}>
                            <CropFreeOutlinedIcon   className={styles.popover__elem} />
                        </Box>
                        <Typography>{countOfRePosts}</Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={1} >
                        <CommentOutlinedIcon className={styles.popover__elem} />
                        <Typography>{countOfComments}</Typography>
                    </Stack>
                </Stack>

                <MarksComponent  rating={rating} marks={marks}
                                 likeItemHandle={likePostHandle}
                                 disLikeItemHandle={disLikePostHandle}
                                 isLiked={isLiked} isDisLiked={isDisLiked}/>
            </Stack>
        </Box>
    );
};
export default PostFooter;
