import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@mui/material";
import styles from "./WriteForm.module.scss"
import {OutputBlockData, OutputData} from "@editorjs/editorjs";
import {useDispatch} from "react-redux";
import {closeSideBar} from "../../store/slices/sideBarSlice";
import {usePostMutation} from "../../store/api/postsApi";
import dynamic from "next/dynamic";
import {Api} from "../../api/api";
import {useRouter} from "next/router";
import {Box} from "@mui/system";
import { useForm } from "react-hook-form";
import Tags from "../../common/Tags/Tags";
import {PostType} from "../../types/postTypes";
const Editor=dynamic(  ()=> import("../Editor").then(r=>r.Editor),
    {ssr:false}
)
interface WriteFormProps {
  titleDefaultValue?:string,
  defaultBlocks?:OutputData["blocks"],
  type?:"create" | "update",
  defaultTags?:string[]
}
type FormData={
  tagName:string
}
const WriteForm:React.FC<WriteFormProps> = ({titleDefaultValue,defaultBlocks
                                              ,type,defaultTags}) => {
  const [title,setTitle]=useState(titleDefaultValue || '');
  const [blocks,setBlocks]=useState<OutputBlockData[]>(defaultBlocks || [])
  const [isLoading,setIsLoading]=useState(false)
  const [tags,setTags]=useState<string[]>(defaultTags || []);
  const {handleSubmit,register,reset}=useForm<FormData>();
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(closeSideBar())
  },[])
  const router=useRouter()
  const [createPost]=usePostMutation()
  const createPostHandle=async ()=>{
    if (title && blocks.length){
      const id=router.query?.id
      if (type==="update" && id){
        setIsLoading(true)
        const result=await Api().posts.updatePost(id as string,{title,body:blocks,tags})
        if (result){
          router.push(`/posts/${id}`)
        }
        setIsLoading(false)
      }
      else {
        setIsLoading(true)
        // @ts-ignore
        const result:{data?:PostType,error?:any}=await createPost({title,body:blocks,tags});
        if (result.data?.id){
          router.push(`/posts/${result.data.id}`)
        }
        setIsLoading(false)
      }
    }
  }
  const onAddTagHandle=(data:FormData)=>{
    const findedTag=tags.find(tag=>tag===data.tagName)
    if (!findedTag)  setTags(prevState =>([...prevState,data.tagName]) )
    reset({tagName:""})
  }
  const deleteTagHandle=(name:string)=>setTags(prevState =>(prevState.filter(tag=>tag!==name)) )
  return (
      <div className={styles.container}>
        <TextField
            value={title}
            onChange={e=>setTitle(e.target.value)}
            className={styles.titleInput}
            style={{fontSize:"2rem !important"}}
            sx={{fontSize:"2rem !important"}}
            variant="standard"
            margin="normal"
            required
            id="phoneNumber"
            name="phoneNumber"
            autoFocus
            placeholder="Title"
            InputProps={{
              style:{
                fontSize:50
              },
              disableUnderline: true, // <== added this
            }}
        />
        <Box className={styles.editor} >
          <Editor defaultBlocks={blocks} onChange={(blocks)=>setBlocks(blocks)}    />
        </Box>
        <Box>
          <form onSubmit={handleSubmit(onAddTagHandle)}>
            <TextField fullWidth {...register("tagName")}
                       label={"enter tags"} sx={{mb:1}}   />
          </form>

          <Tags deleteTagHandle={deleteTagHandle} tags={tags}  />
        </Box>

        {<Button className={`${styles.button} ${isLoading ? styles.loadingButton:""}`} onClick={createPostHandle} variant={"contained"} >
          { isLoading ? "Loading...": type || "create"}
        </Button> }
      </div>
  );
};
export default WriteForm;
