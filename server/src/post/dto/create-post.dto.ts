import {IsArray, IsString} from "class-validator";
export class CreatePostDto{
    @IsString()
    title:string
    @IsArray()
    body:Array<any>
    @IsArray()
    tags:string[]
}
