import React, {useState} from "react";
import classes from './Header.module.scss';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from 'next/image'
import {useAppDispatch, useAppSelector} from "../../store/store";
import {Avatar, Box, Typography} from "@mui/material";
import { logOut } from "../../store/slices/authSlice";
import stringAvatar from "../../utils/stringToColor/stringToColor";
import { toggleSideBar } from "../../store/slices/sideBarSlice";
import logo from './../../assets/logo.png'
import {useRouter} from "next/router";
const Header = () => {
    const isAuth=useAppSelector(state => state.auth.isAuth);
    const user=useAppSelector(state => state.auth.user);
    const dispatch=useAppDispatch();
    const router=useRouter();
    const logOutHandle=()=>dispatch(logOut())
    const toggleSideBarHandle=()=>dispatch(toggleSideBar())
    const [inputValue,setInputValue]=useState(router?.query?.query || "")
    const searchPosts=(e:any)=>{
        e.preventDefault();
        if (typeof inputValue==="string" && inputValue.trim()){
            router.push({
                pathname:'/search',
                query:{
                    ...router.query,
                    query:inputValue,
                }
            })
        }
    }
    return (
        <Box className={classes.header}>
            <div className={classes.header__container}>
                <div onClick={toggleSideBarHandle} className={classes.header__block}>
                    <div className={classes.header__burger}>
                        <span/>
                    </div>
                    <div className={classes.header__logo}>
                        <Link href={"/"}>
                            <a>
                                <Image
                                    width={50}
                                    height={50}
                                    alt={"Logo"}
                                    layout={"intrinsic"}
                                    src={logo}/>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={classes.header__block}>
                    <form onSubmit={searchPosts}  className={classes.header__search}>
                        <TextField onChange={e=>setInputValue(e.target.value)} value={inputValue} style={{width:300}}   size={"small"} id="outlined-basic" label="Search" variant="outlined" />
                    </form>
                    <div className={classes.header__button}>
                        <Link href={"/write"}>
                            <a>
                                <Button variant="contained">Create</Button>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={classes.header__block} >
                    {isAuth  && Object.values(user).length  ?   <div className={classes.header__user}>
                        <Link href={"/profile"} >
                            <a style={{display:"flex",alignItems:"center"}}>
                                {user.logo ?  <Image width={50}
                                       height={50} src={user.logo}  alt={user.fullName} layout={'intrinsic'} />:<Avatar {...stringAvatar(user.fullName)} /> }
                                <Typography sx={{mr:1}} variant={"h6"}>{user.fullName}</Typography>
                            </a>
                        </Link>
                        <Button onClick={logOutHandle} variant={"outlined"} >LogOut</Button>
                    </div>: <Link href={"/login"}>
                        <a>
                            <Button variant="contained">Login</Button>
                        </a>
                    </Link>}

                </div>
            </div>
        </Box>
    );
};

export default Header;
