import {AxiosInstance} from "axios";
import {LoginQueryArg, LoginResultType, RegistrationQueryArg, SimpleUserType} from "../types/authTypes";
import {DataType} from "../types/apiTypes";

export const authApi=(instance:AxiosInstance)=>({
    login: async (body:LoginQueryArg)=>{
          const {data}=  await instance.post<LoginQueryArg,DataType<LoginQueryArg>>("/auth/login",body)
            return data
    },
    async register(body:RegistrationQueryArg){
    const {data}=  await instance.post<LoginQueryArg,DataType<LoginResultType>>("/auth/registration",body)
    return data
    },
    async me(){
        const {data}=  await instance.get<void, DataType<SimpleUserType>>("/auth/me")
        return data
    },
})
