import React, {useEffect, useState} from 'react';
import classes from "../../pages/profile/Profile.module.css";
import {Avatar, Box, Button, IconButton, Paper, Tab, Tabs, Typography} from "@mui/material";
import Image from "next/image";
import stringAvatar from "../../utils/stringToColor/stringToColor";
import  {a11yProps} from "../../common/TabPanel/TabPanel";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {useRouter} from "next/router";
import Link from 'next/link';
import {getProfileSelector} from "../../store/selectors/profileSelectors";
import classNames from "classnames";
import styles from "../../components/Post/Post.module.scss";
import {PhotoCamera} from "@mui/icons-material";
import {getUser} from "../../store/selectors/authSelectors";
import {updateUserImage} from "../../store/thunks/profileThunks";
 const Profile:React.FC =React.memo( () => {
     const {pathname,query,}=useRouter();
        const [value, setValue] = React.useState<number>(0);
        useEffect(()=>{
            const secondParam=query && query?.id && query?.id[1]==="comments"
            setValue(pathname.includes("comments") ? 1:secondParam ? 1:0)
        },[query,pathname])
    const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue);
     const profile=useAppSelector(getProfileSelector);
     const userId=useAppSelector(getUser)?.id
     const [idParam,setIdParam]=useState<string | undefined>("");
     const dispatch=useAppDispatch();
     useEffect(()=>{
         const queryParam=query?.id && query?.id[0]
         const idParam=Number(queryParam) ? queryParam:""
         setIdParam(idParam)
     },[])
     const isMyProfilePage=userId===profile.id
     const updateImageHandle= async (e:any)=>{
         if (e.target.files){
             const formData=new FormData();
             formData.append("image",e.target.files[0])
           // @ts-ignore
             await  dispatch(updateUserImage(formData))
         }
     }
    return (
        <Box className={classes.profile}>
                        {profile.headerImage || isMyProfilePage  ?   <Box className={
                            classNames({
                                [classes.profile__header]:true,
                                [classes.profile__header_author]:isMyProfilePage
                            })
                        } >
                            {profile.headerImage && <Box className={classes.header__image}>
                                <Image
                                    width={960}
                                    height={280}
                                    loading="lazy"
                                    layout={"intrinsic"} src={`http://localhost:5000/users/headerImages/${profile.headerImage}`} alt={profile?.fullName}/>
                            </Box>  }
                            <div className={classes.header__tools}>
                                <Paper>
                                    <IconButton color="primary" aria-label="upload picture" component="label">
                                        <input onChange={updateImageHandle} hidden accept="image/*" type="file" />
                                        <PhotoCamera />
                                    </IconButton>
                                </Paper>
                            </div>
                        </Box>:""}
                        <Box className={classes.profile__content}>
                            <Box className={classNames({
                                    [classes.profile__logo]:!!profile.headerImage || isMyProfilePage
                                }
                            )}>
                                {profile.logo ?   <Image width={100} height={100} layout={"intrinsic"} src={profile?.logo} alt={profile?.fullName}/>
                                    :<Avatar style={{width:100,height:100,fontSize:50}} {...stringAvatar(profile?.fullName)} />}
                            </Box>
                            <Typography variant={"h4"}>{profile?.fullName}</Typography>
                            {profile.description  ? <Typography>{profile?.description}</Typography>:""}
                            {<Typography className={classNames({
                                [styles.green]:profile.rating>0,
                                [styles.red]:profile.rating<0
                            })}>{profile.rating>0 ? "+":""}{profile.rating}</Typography>}
                            {!idParam ? <Link href={"/profile/settings"}>
                                <a>
                                    <Button>
                                        Change a profile data
                                    </Button>

                                </a>
                            </Link>:""  }
                            {<Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Link href={`/profile/${idParam}`}>
                                            <a>
                                                <Tab  label="Posts" {...a11yProps(0)} />
                                            </a>
                                        </Link>
                                        <Link href={idParam ? `/profile/${idParam}/comments`:`/profile/comments`}>
                                            <a>
                                                <Tab  label="Comments" {...a11yProps(1)} />
                                            </a>
                                        </Link>
                                    </Tabs>
                                </Box>
                            </Box>}
                        </Box>
                    </Box>
    );
});
export default Profile
