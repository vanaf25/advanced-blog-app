import React from 'react';
import {Stack} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import styles from "../../components/Post/Post.module.scss";
import MousePopover from "../MousePopover/MousePopover";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import {MarkType} from "../../types/postTypes";
import {useAppSelector} from "../../store/store";
import {getIsAuth} from "../../store/selectors/authSelectors";
import Link from "next/link";
import classNames from "classnames";
type MarksComponentProps={
rating:number,
    marks:MarkType[],
    likeItemHandle:()=>void,
    disLikeItemHandle:()=>void,
    isLiked:boolean,
    isDisLiked:boolean
}
const MarksComponent:React.FC<MarksComponentProps> = (
    {rating,marks, disLikeItemHandle,likeItemHandle,
        isDisLiked,isLiked}) => {
    const isAuth=useAppSelector(getIsAuth);
    const Like=<KeyboardArrowUpOutlinedIcon
        onClick={likeItemHandle}
        className={classNames({
            [styles.green]:isLiked && isAuth,
            [styles.arrow]:true
        })}/>
        const DisLike=<KeyboardArrowDownOutlinedIcon
            onClick={disLikeItemHandle}
            className={classNames({
                [styles.red]:isDisLiked && isAuth ,
                [styles.arrow]:true
            })}/>
    return (
        <Stack direction={"row"}>
            {isAuth ?  DisLike:
                 <Link href={"/login"}>
                <a>{DisLike}</a>
            </Link>
        }
            {marks?.length &&   <MousePopover marks={marks} rating={rating}/>}
            {isAuth ?
                Like:
                <Link href={"/login"}>
                    <a>{Like}</a>
                </Link>
            }
        </Stack>
    );
};
export default MarksComponent;
