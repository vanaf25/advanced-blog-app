import React from 'react';
import classes from './SideBar.module.css'
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import {useRouter} from "next/router";
import Link from "next/link";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import {useAppSelector} from "../../store/store";
import {getIsAuth} from "../../store/selectors/authSelectors";
 const pages=[
    {
        id:1,
        text:"Popular",
        icon:WhatshotOutlinedIcon,
        href:"/",
        isPublic:true
    },
    {
        id:2,
        text:"New",
        icon:AccessTimeOutlinedIcon,
        href:"/new",
        isPublic:true
    },
    {
        id:3,
        text:"Rating",
        icon:TrendingUpOutlinedIcon,
        href:"/rating",
        isPublic:true
    },
    {
        id:5,
        text:"Bookmarks",
        icon: BookmarkBorderOutlinedIcon,
        href:"/bookmarks",
        isPublic:false
    },

]
const SideBar = () => {
    const {pathname}=useRouter();
    const isAuth=useAppSelector(getIsAuth);
    return (
        <div className={classes.sideBar}>
            {pages
                .filter(page=>page.isPublic || isAuth)
                .map(page=><Link key={page.id} href={page.href} >
                <a> <div  className={`${classes.sideBar__card} ${page.href===pathname ? classes.active :""}`}>
                    <page.icon sx={{
                        mr:1
                    }} />
                    {page.text}
                </div></a>
            </Link>)}
        </div>
    );
};

export default SideBar;
