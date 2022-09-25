import {ExtendUserType} from "./users";
export type UpdateProfileDto=Omit<Partial<ExtendUserType>,"id" | "logo"> & {logo:File | undefined | string}
export class SearchUserDto {
    fullName?:string
    page?:number
    take?:number
    isCleanUsers?:boolean
}
