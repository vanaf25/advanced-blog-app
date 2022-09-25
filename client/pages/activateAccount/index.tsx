import React, {useState} from 'react';
import {NextPage} from "next";
import {withAuth} from "../../utils/withAuth";
import {getIsAuth, getUser} from "../../store/selectors/authSelectors";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {Button, Paper, Typography} from "@mui/material";
import activateAccount from '../../assets/activateAccount.png'
import Image from 'next/image'
import styles from './styles.module.scss'
import {useRouter} from "next/router";
import {Api} from "../../api/api";
import {AlertSeverity, setErrorText} from "../../store/slices/errorSlice";
const Activate:NextPage = () => {
    const user=useAppSelector(getUser)
    const router=useRouter();
    const [isFetching,setIsFetching]=useState(false);
    const isAuth=useAppSelector(getIsAuth)
    const dispatch=useAppDispatch();
    if (user.isActivated || !isAuth) router.push("/")
    const reSendMailHandle=async ()=>{
        if (!user.isActivated){
            setIsFetching(true)
            await Api().profile.reSendVerificationCode()
            setIsFetching(false)
            dispatch(setErrorText({
                severity:AlertSeverity.Success,
                alertText:"Email has sent successfully"
            }))
        }
    }
    return (
        <Paper className={styles.rootBlock}>
                <Image width={250} height={250}
                       alt={"Activate Account"}
                       src={activateAccount}
                       layout={"intrinsic"} />
                <Typography>Hello, {user.fullName}. You must activate your account for using
                    this application. We are sent verification  link to your email.
                    To activate your account just click on the link in your email  </Typography>
                <Button onClick={reSendMailHandle} disabled={isFetching}  variant={"contained"}>Send verification link again</Button>
        </Paper>
    );
};
export const getServerSideProps=withAuth((store)=>{
    const state=store.getState();
    const user=getUser(state)
    const isAuth=getIsAuth(state)
   if (user.isActivated || !isAuth) return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }
})
export default Activate;
