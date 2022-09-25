import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import React, {useState} from 'react';
import classes from './../login/Login.module.css'
import {Controller, useForm} from "react-hook-form";
import Link from "next/link";
import { useRouter } from 'next/router'
import {useRegistrationMutation} from "../../store/api/authApi/authApi";
import {withAuth} from "../../utils/withAuth";
import {getIsAuth} from "../../store/selectors/authSelectors";
type formData={
    fullName:string,
    email:string,
    repeatPassword:string
    password:string,
}
type FieldType={
    id:number,
    name:keyof formData,
    rules:any,
    typeOfField:string
}
const Registration:React.FC = () => {
    const [registration,{isLoading}]=useRegistrationMutation()
    const {handleSubmit,formState:{errors},control,reset,getValues} = useForm<formData>();
    const router=useRouter()
    const [loginError,setLoginError]=useState("");
    const onSubmit = async (data:formData) =>{
        try {
            // @ts-ignore
            const response:{data?:UserType,error?:any }=await registration(data)
            if (response.error){
                setLoginError(response.error.data.message)
            }
            else{
                await router.push("/")
                reset({
                    fullName:"",
                    email:"",
                    password:"",
                    repeatPassword:""
                })
            }

        }
        catch (e) {
        }

    };
    const fields:Array<FieldType>=[
        {
            id:1,
            name:"fullName",
            rules:{
                required:"Name is required",
                minLength: {
                    value: 3,
                    message: "Min length is 3"
                }
            },
            typeOfField:"text"
        },
        {
            id:2,
            name:"email" ,
            rules:{
                required:"Email is required",
                pattern:{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address"
                }
            },
            typeOfField:"text"
        },
        {
            id:3,
            name:"password",
            rules:{
                required:"Password is required",
                pattern: {
                    value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: "Password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
                }
            },
            typeOfField:"password"
        },
        {
            id:4,
            name:"repeatPassword",
            rules:{
                required:"Repeat the password",
                validate:(value:string)=>value===getValues("password") ? true :"Repeat the password"
            },
            typeOfField:"password"
        }
    ]
    return (
        <div className={classes.form}>
            <h2 className={classes.form__title}>Registration</h2>
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
                <Link href={"/login"}>
                    <a><Box sx={{ color: 'primary.main',marginBottom:"10px" }}>You Have an account? Login!</Box></a>
                </Link>
                <Button className={isLoading ? classes.loading:"" } disabled={isLoading} type={"submit"}  variant="contained">Registration</Button>
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
export default Registration
