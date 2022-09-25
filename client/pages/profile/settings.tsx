import React, {useState} from 'react';
import {useAppSelector, wrapper} from "../../store/store";
import {getIsAuth, getUser} from "../../store/selectors/authSelectors";
import {Avatar, Button, Card, TextField, Typography} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {FieldType, InputsType} from "../../types/formTypes";
import stringAvatar from "../../utils/stringToColor/stringToColor";
import Image from 'next/image'
import {useUpdateProfileMutation} from '../../store/api/profileApi';
import {getProfile} from "../../store/thunks/profileThunks";
import {withAuth} from "../../utils/withAuth";
import {useRouter} from "next/router";
type FormData={
    logo:string,
    fullName:string,
    description:string,
    email:string
}
type ProfileField=FieldType<FormData>

const Settings = () => {
    const profile=useAppSelector(state => state.profile.profile);
    const {handleSubmit,formState:{errors},control,reset,register} = useForm<FormData>({defaultValues:{
        description:profile.description || "" ,fullName:profile.fullName,email:profile.email}});
    const [formError,setFormError]=useState("")
    const fields:Array<ProfileField>=[
        {
            id:1,
            name:"logo",
            typeOfField:InputsType.FILE
        },
        {
            id:2,
            name:"email",
            rules:{
                pattern:{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address"
                }
            },
            typeOfField:InputsType.TEXT
        },
        {
            id:3,
            name:"fullName",
            rules:{
                required:"Name is required",
                minLength: {
                    value: 3,
                    message: "Min length is 3"
                }
            },
            typeOfField:InputsType.TEXT
        },
        {
            id:4,
            name:"description",
            typeOfField:InputsType.TEXT
        }]
    const [result,{isLoading}]=useUpdateProfileMutation()
    const [uploadedLogo,setUploadedLogo]=useState("")
    const [file,setFile]=useState<File>()
    const {push}=useRouter();
    const onSubmit = async (data:FormData) =>{
        const response:{data?:any,error?:any }=await result({...data,logo:file})
        if (response?.error?.data?.message){
            setFormError(response.error.data.message)
        }
        if (response.data){
            push("/profile");
        }
    };
    return (
        <Card  sx={{py:3,px:1,width:600,margin:"0 auto"}}>
            <Typography sx={{textAlign:"center",mb:1}} variant={"h4"}>Change a profile Data</Typography>
            <form  onSubmit={handleSubmit(onSubmit)}>
                {fields.map(textField=><Controller key={textField.id}
                                                   name={textField.name}
                                                   control={control}
                                                   rules={textField.rules}
                                                   render={
                                                       ({ field }) =>textField.name==="logo" ? <>
                                                           {profile.logo || uploadedLogo ?
                                                               <Image  layout={"intrinsic"}
                                                                      width={200}
                                                                      style={{marginBottom:10,display:"block"}}
                                                                      alt="Picture of the author"
                                                                      height={200}
                                                                      src={uploadedLogo ? uploadedLogo: profile.logo}/>
                                                               :
                                                               <Avatar style={{width:100,height:100,fontSize:50,
                                                                   marginBottom:10}} {...stringAvatar(profile.fullName)}/>}
                                                           <input
                                                               onChange={e=>{
                                                                   e.target.files &&
                                                               setUploadedLogo(URL.createObjectURL(e.target.files[0]))
                                                                   e.target.files &&  setFile(e.target.files[0])
                                                               }}
                                                               name={textField.name}
                                                               accept="image/*"
                                                               style={{display:"none"}}
                                                               id="contained-button-file"
                                                               multiple
                                                               type="file"
                                                           />
                                                           <label htmlFor="contained-button-file">
                                                               <Button fullWidth variant="contained" sx={{margin:"0 auto",maxWidth:"max-content"}} component="span">
                                                                   Upload
                                                               </Button>
                                                           </label>

                                                       </>: <TextField
                                                           type={textField.typeOfField}
                                                           helperText={errors[textField.name]?.message}
                                                           error={textField.name in errors || !!formError }
                                                           margin={"normal"}  fullWidth
                                                           label={textField.name}  {...field} />
                                                   }
                />)}
                {formError && <Typography sx={{color:"red",mb:1,textAlign:"center"}}>{formError}</Typography>}
                <Button disabled={isLoading} fullWidth type={"submit"} variant="contained">
                    {isLoading ? "Loading...": "Change"}
                </Button>
            </form>
        </Card>
    );
};
export const getServerSideProps=withAuth(async (store,ctx)=>{
    const state=store.getState();
    const user=getUser(state);
    const isAuth=getIsAuth(state)
    if (isAuth){
        const id=user.id
        const profile=state.profile.profile
        const dispatch=store.dispatch
        if (profile?.id!==id){
          await  dispatch(getProfile(id))
        }
        return {
            props:{

            }
        }
    }
    return {
        redirect: {
            destination: '/login',
            permanent: false
        }
    }
})
export default Settings;

