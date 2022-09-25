import {SimpleUserType} from "./authTypes";
export type ExtendUserType=SimpleUserType &
    {createdAt:string,updatedAt:string,description:string,email:string,rating:number,headerImage:string | null}
