import {IsNotEmpty, IsOptional} from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    text:string
    @IsNotEmpty()
    postId:string
    @IsOptional()
    parentId:number
}
