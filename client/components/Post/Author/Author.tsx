import React from 'react';
import {Box} from "@mui/system";
import Image from "next/image";
import {Avatar, Stack} from "@mui/material";
import stringAvatar from "../../../utils/stringToColor/stringToColor";
import {SimpleUserType} from "../../../types/authTypes";
import styles from '../Post.module.css'
import Link from "next/link";
import AuthorContent from "./AuthorContent";
type AuthorProps={
    author:SimpleUserType
    textColor?:"red" | "green",
    withOutLink?:boolean
}
const Author:React.FC<AuthorProps> = ({author,textColor,withOutLink}) => {
    return (
        <>
            {withOutLink ? <AuthorContent author={author}/> : <Link href={`/profile/${author?.id}`}>
            <a>
                <AuthorContent author={author} textColor={textColor}/>
            </a>
            </Link>}
        </>
    );
};

export default Author;
