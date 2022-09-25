import {IsNotEmpty} from "class-validator";

export class CreateMarkDto {
    @IsNotEmpty()
    postId:number
    @IsNotEmpty()
    commentId:number
    @IsNotEmpty()
    type:"like" | "dislike"
}
