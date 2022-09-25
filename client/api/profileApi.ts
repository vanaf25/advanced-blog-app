import {AxiosInstance} from "axios";
import {ExtendUserType} from "../types/users";
import {DataType, ItemsType, UpdateSuccessType} from "../types/apiTypes";
import {SearchUserDto, UpdateProfileDto} from "../types/profileTypes";
export const profileApi=(instance:AxiosInstance)=>({
    async profile(id:  number | string ){
            const {data}=  await instance.get<void,{data:ExtendUserType}>(`users/${id}`)
            return data
    },
    async updateProfile(body:UpdateProfileDto){
        const {data}=await instance.patch<UpdateSuccessType,{data:UpdateProfileDto}>(`users`,body)
        return data
    },
    async getUsers(query:SearchUserDto){
        const {data}=await instance.get<void,DataType<ItemsType<ExtendUserType[]>>>(`users`,{
            params:query
        })
        return data
    },
    async updateHeaderImage(body:{image:File}){
        const {data}=await instance.patch("users/uploadHeaderImage",body);
        return data
    },
    async reSendVerificationCode(){
        try {
            const {data}=await instance.patch("users/sendActivationCode")
            return data
        }
        catch (e) {

        }
    }
})
