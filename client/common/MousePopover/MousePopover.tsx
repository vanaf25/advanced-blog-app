import React from "react";
import {makeStyles} from "@mui/styles";
import {Popover, Stack, Typography} from "@mui/material";
import Author from "../../components/Post/Author/Author";
import {MarkType} from "../../types/postTypes";
import styles from './MousePopover.module.css'
import classes from '../../components/Post/Post.module.scss'
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import {Box} from "@mui/system";
const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: "none"
    },
}));
type MouseOverPopover={
    rating?:number,
    marks?:MarkType[],
    children?:JSX.Element | JSX.Element[]
}
const  MouseOverPopover:React.FC<MouseOverPopover>=({rating,marks,children})=> {
    const muiClasses = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event:any) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
            {marks  ?    <Typography
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
            >
                {rating !== undefined  &&  <span style={{color:rating>=0 ? "#00701a" :"#ba000d"}}>
                 {rating}
             </span>}
            </Typography> :<ShareOutlinedIcon className={classes.popover__elem}/>}
            <Popover
                id="mouse-over-popover"
                className={muiClasses.popover}
                classes={{
                    paper: styles.paper
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {marks ?    <Stack spacing={1}>
                        {marks?.map(mark=><Author textColor={mark.type==="like" ? "green":"red"} key={mark.id} author={mark.user}/>)}
                    </Stack> :children }
            </Popover>
        </Box>
    );
}
export default MouseOverPopover
