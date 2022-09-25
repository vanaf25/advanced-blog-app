import React from 'react';
import {Box} from "@mui/system";
import styles from "../../components/Post/Post.module.css";
import Author from "../../components/Post/Author/Author";
import {formatDistanceToNow} from "date-fns";
import PopoverComponent from "../Popover/Popover";
import {SimpleUserType} from "../../types/authTypes";
import {useAppSelector} from "../../store/store";
import {getUser} from "../../store/selectors/authSelectors";
import {Stack} from "@mui/material";
type CardHeaderProps={
    author:SimpleUserType
    createdAt:string
    itemId:number
}
const CardHeader:React.FC<CardHeaderProps> = (
    {author,createdAt,itemId}) => {
    const userId=useAppSelector(getUser)?.id
    return (
        <Stack direction={"row"} alignItems={"center"}
               justifyContent={"space-between"}
               sx={{mb:1}}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <Author author={author}/>
                <Box>
                    {formatDistanceToNow(new Date(createdAt))} ago
                </Box>
            </Stack>
            {userId===author.id && <PopoverComponent type={"post"} itemId={itemId}/>}
        </Stack>
    );
};

export default CardHeader;
