import {Box, Button, TextField,} from '@mui/material';
import React, {useEffect, useState} from 'react';
import classes from './Login.module.css'
import {Controller, useForm} from "react-hook-form";
import Link from "next/link";
import {useLoginMutation} from '../../store/api/authApi/authApi';
import {useRouter} from 'next/router'
import {FieldType, InputsType} from "../../types/formTypes";
import {useAppSelector} from "../../store/store";
import {withAuth} from "../../utils/withAuth";
import GoogleLogin from "react-google-login";
import {getIsAuth} from "../../store/selectors/authSelectors";
type FormData={
    login:string,
    password:string,
}
type LoginField=FieldType<FormData>
const clientId="411530950247-ocnjonaavsb7k7alv73atjvtgn76bntg.apps.googleusercontent.com";
const Login:React.FC = () => {
    useEffect(()=>{
       /* function start(){
            gapi.client.init({
                clientId,
                scope: ""
            })
        }
            gapi.load("client:auth2",start)*/

    },[]);
    const router = useRouter();
    const [login,{isLoading}]=useLoginMutation()
    const isAuth=useAppSelector(state => state.auth.isAuth)
    useEffect(()=>{
        if (isAuth){
            router.push("/")
        }
    },[isAuth])
    const {handleSubmit,formState:{errors},control,reset} = useForm<FormData>();
    const [loginError,setLoginError]=useState("");
    const onSubmit = async (data:FormData) =>{
        try {
            // @ts-ignore
            const response:{data?:UserType,error?:any }=await login(data)
            if (response.error){
                setLoginError(response.error.data.message)
            }
            /*else{
                await router.push("/")
                reset({
                    login:"",
                    password:"",
                })
            }*/

        }
        catch (e) {
        }

    };
    const fields:Array<LoginField>=[
        {
            id:1,
            name:"login",
            rules:{
                required:"Enter the Name or Email",
            },
            typeOfField:InputsType.TEXT
        },
        {
            id:2,
            name:"password",
            rules:{
                required:"Enter the password",
            },
            typeOfField:InputsType.PASSWORD
        },
    ]
    const onSuccess=(response:any)=>{
        console.log('response',response)
    }
    const onFailure=(response:any)=>{
        console.log('onFailure',response);
    }
    return (
        <div  className={classes.form}>
            <h2 className={classes.form__title}>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map(textField=><Controller key={textField.id}
                                                   name={textField.name}
                                                   control={control}
                                                   rules={textField.rules}
                                                   render={
                                                       ({ field }) =><TextField
                                                           type={textField.typeOfField}
                                                           helperText={errors[textField.name]?.message}
                                                           error={textField.name in errors || !!loginError }
                                                           margin={"normal"}  fullWidth
                                                           label={textField.name}  {...field} />}
                />)}
                {loginError && <p style={{color:"red"}}>{loginError}</p>}
                <Link href={"/registration"}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <a href=""><Box sx={{ color: 'primary.main',marginBottom:"10px" }}>Don't Have an account? Registration!</Box></a>
                </Link>
                <GoogleLogin
                    style={{marginBottom:10,display:"block"}}
                    className={classes.loginButtons}
                    clientId={clientId}
                    buttonText="Login with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                />
                <Button className={`${classes.loginButtons} ${isLoading ? classes.loading:""}`} disabled={isLoading}  type={"submit"}  variant="contained">Login</Button>
            </form>
        </div>
    );
};
export const getServerSideProps=withAuth((store)=>{
const isAuth=getIsAuth(store.getState())
    if (isAuth)  return {
        redirect: {
            destination: "/",
            permanent: false
        }
    }
})
export default Login
