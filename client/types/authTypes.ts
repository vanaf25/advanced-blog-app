import {ExtendUserType} from "./users";
export type SimpleUserType={
    id: number,
    fullName: string,
    logo: string,
    isActivated:boolean
}
export type LoginQueryArg={
    login:string,
    password:string
}
export type RegistrationQueryArg=Omit<SimpleUserType,"id" | "logo"> & {password:string}
export type LoginResultType={user:ExtendUserType,token:string}
