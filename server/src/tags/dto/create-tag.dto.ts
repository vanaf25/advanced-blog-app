import {IsNotEmpty} from "class-validator";
export class CreateTagDto {
    @IsNotEmpty()
    text:string
    @IsNotEmpty()
    postId:number
}
