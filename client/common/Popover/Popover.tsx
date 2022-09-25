import React, {useState} from 'react';
import {Button, Popover, Typography} from "@mui/material";
import styles from "../../components/Post/Post.module.scss";
import Link from "next/link";
import {Api} from "../../api/api";
import {useAppDispatch} from "../../store/store";
import {deleteComment} from "../../store/thunks/commentsThunks";
import {deletePost} from "../../store/thunks/postsThunks";
type PopoverComponentProps={
    type:"post" | "comment",
    itemId:number,
    toggleEditMode?:()=>void
}
const PopoverComponent:React.FC<PopoverComponentProps> = ({type,itemId,toggleEditMode}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [isLoading,setIsLoading]=useState(false);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const dispatch=useAppDispatch();
    const deleteItemHandle=async ()=>{
        setIsLoading(true)
        if (type==="post") await dispatch(deletePost(itemId))
      else await dispatch(deleteComment(itemId))
        setIsLoading(false);
      setAnchorEl(null);
    }
    return (
            <div>
                <Button aria-describedby={id}  onClick={handleClick}>
                    ...
                </Button>
                <Popover
                    id={id}
                    open={open}
                    onClose={handleClose}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography onClick={deleteItemHandle} className={styles.popover__elem}
                                sx={{p:2,color:"#f44336"}}>
                        {isLoading ? "Deleting...":`Delete ${type}`}</Typography>
                    {type==="post" ? <Link  href={`/write/${itemId}`}>
                        <a>
                            <Typography className={styles.popover__elem} sx={{padding:"0 20px 20px 20px"}}>Edit {type}</Typography>
                        </a>
                    </Link>:   <Typography onClick={()=>{
                        if (toggleEditMode){
                            toggleEditMode()
                            handleClose()
                        }
                    }}  className={styles.popover__elem} sx={{padding:"0 20px 20px 20px"}}>Edit {type}</Typography>}
                </Popover>
            </div>
    );
};
export default PopoverComponent;
