import {OutputBlockData} from "@editorjs/editorjs";
import {Box, Stack, Typography} from "@mui/material";
import styles from "../../pages/posts/Posts.module.scss";
import parse from "react-html-parser";
import classNames from "classnames";
import Image from "next/image";
import React from "react";
export const parseBlock=(block:OutputBlockData)=>{
    if (block.type==="paragraph") return <Typography className={styles.paragraph} sx={{mb:1}}>{parse(block.data.text)}</Typography>
    if (block.type==="list"){
        if (block.data.style==="unordered"){
            return (<ul>
                {block.data.items.map((item:string)=><li style={{marginBottom:5}}>{parse(item)}</li>)}
            </ul>)
        }
        else{
                return (<ol>
                    {block.data.items.map((item:string)=><li style={{marginBottom:5}}>{parse(item)}</li>)}
                </ol>)
            }
            }
            if (block.type==="header"){
                return  <Typography   variant={`h${block.data.level}` as any}>{parse(block.data.text)}</Typography>
            }
            if (block.type==="image"){
                return <Box className={classNames({
                                                      [styles.post__image_border]:block.data.withBorder
                                                  })} sx={{mb:1}}>
                <Stack className={classNames({
                                                 [styles.post__image_background]:block.data.withBackground
                                             })} justifyContent={block.data.withBackground ? "center":"start"} direction={"row"}>
                <Image src={block.data.file.url}
                alt={"Image not found"}
                layout={"intrinsic"}
                width={block.data.file.width}
                height={block.data.file.height}
                />
                </Stack>
                {block.data.caption && <Typography sx={{p:1}}>
                    {block.data.caption}
                    </Typography>}
                    </Box>
                }
            }
