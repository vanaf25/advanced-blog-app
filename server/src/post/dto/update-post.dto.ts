import {IsArray, IsOptional, IsString} from "class-validator";
export class UpdatePostDto  {
    @IsArray()
    @IsOptional()
    body?:any[]
    @IsString()
    @IsOptional()
    title?:string
    @IsArray()
    tags?:string[]
}
