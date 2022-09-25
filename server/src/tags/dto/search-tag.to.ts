import {IsOptional, IsString} from "class-validator";

export class SearchTagDto{
    @IsOptional()
    @IsString()
  tagName:string
}
