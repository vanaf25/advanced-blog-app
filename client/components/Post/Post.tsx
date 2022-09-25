import React from 'react';
import styles from "./Post.module.scss";
import imageStyles from './../../pages/posts/Posts.module.scss'
import {Box} from "@mui/system";
import {Card, NoSsr, Stack, Typography} from "@mui/material";
import {PostType} from "../../types/postTypes";
import Link from "next/link";
import CardHeader from "../../common/CardHeader/CardHeader";
import PostFooter from "./PostFooter/PostFooter";
import classNames from "classnames";
import ReactHtmlParser from 'react-html-parser'
import Image from "next/image";
type PostProps={
    post:PostType
}
const Post:React.FC<PostProps> = ({post:{author,...post}}) => {
    const firstImage=post.firstImage?.data
    return (
        <Card sx={{mb:1,p:2}} className={styles.post}>
            <CardHeader author={author}
                        itemId={post.id}
                        createdAt={post.createdAt}/>
            <Link href={`/posts/${post.id}`}>
                <a>
                    <Box sx={{mb:1}}>
                        <Typography variant="h4"  >
                            {post.title}
                        </Typography>
                        {post.description && <Typography variant={"subtitle1"}>
                            <NoSsr>
                                { ReactHtmlParser(post.description)}
                            </NoSsr>
                        </Typography>}
                        {firstImage ?     <Box className={classNames({
                            [imageStyles.post__image_border]:firstImage.withBorder
                        })} sx={{mb:1}}>
                            <Stack className={classNames({
                                [imageStyles.post__image_background]:firstImage.withBackground
                            })} justifyContent={firstImage.withBackground ? "center":"start"} direction={"row"}>
                                <Image src={firstImage.file.url}
                                       alt={"Image not found"}
                                       layout={"intrinsic"}
                                       loading={"lazy"}
                                       width={firstImage.file.width}
                                       height={firstImage.file.height}
                                />
                            </Stack>
                            {firstImage.caption && <Typography sx={{p:1}}>
                                {firstImage.caption}
                            </Typography>}
                        </Box>:""}
                    </Box>
                </a>
            </Link>
           <PostFooter
               countOfComments={post.countOfComments}
               countOfRePosts={post.countOfRePosts}
               tags={post.tags}
               postTitle={post.title}
               isLiked={post.isLiked} isDisLiked={post.isDisLiked}
               marks={post.marks} isBookmark={post.isBookmark}
               postViews={post.views} rating={post.rating} authorId={author.id}
                       postId={post.id} />
        </Card>
    );
};

export default Post;

