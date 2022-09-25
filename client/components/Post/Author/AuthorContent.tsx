import React from 'react';
import styles from "../Post.module.scss";
import Image from "next/image";
import {Avatar, Stack} from "@mui/material";
import stringAvatar from "../../../utils/stringToColor/stringToColor";
import {SimpleUserType} from "../../../types/authTypes";
import {Box} from "@mui/system";
type AuthorContentProps={
    author:SimpleUserType,
    textColor?:"red" | "green",
}
const AuthorContent:React.FC<AuthorContentProps> = ({author,textColor}) => {
    return (
        <Stack className={styles.author} direction={"row"} alignItems={"center"} spacing={1} >
            <Box>
                {author?.logo ?
                    <Avatar sx={{width:30,height:30}} alt={author.fullName} src={author.logo}/>
                    :<Avatar style={{width:30,height:30}} {...stringAvatar(author?.fullName)}/>}
            </Box>
            <Box>
                <strong style={{color:textColor || '#333'}}>{author?.fullName}</strong>
            </Box>
        </Stack>
    );
};

export default AuthorContent;
