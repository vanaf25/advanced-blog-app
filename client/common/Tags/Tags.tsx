import React from 'react';
import {Chip, Stack} from "@mui/material";
import styles from "../../components/Post/Post.module.scss";
import {useRouter} from "next/router";
type TagsProps={
    tags:Array<string>
    deleteTagHandle?:(name:string)=>void
}
const Tags:React.FC<TagsProps> = ({tags,deleteTagHandle}) => {
    const router=useRouter();
    const onClickHandle=(tagName:string)=>{
        router.push({
            pathname:"/search",
            query:{
                tags:JSON.stringify([tagName])
            }
        })
    }
    return (
        <Stack sx={{
            mb:0.5,
            flexWrap: 'wrap'
        }} direction={"row"}  spacing={1}>
            {tags?.map((tag)=><Chip onClick={()=>onClickHandle(tag)} sx={{mb:1}} onDelete={deleteTagHandle ? ()=>deleteTagHandle(tag):undefined}
                                         className={styles.tag}  key={tag}
                                           label={ `#${tag}`} />)}
        </Stack>
    );
};
export default Tags;
