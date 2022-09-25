import {
    Contains,
    IsArray,
    IsBoolean,
    IsBooleanString, IsEmpty,
    IsJSON,
    IsNumberString,
    IsOptional,
    IsString, Validate, ValidateIf
} from "class-validator";
import {isStringObject} from "util/types";
import {TypePostValidator} from "../../utils/validations/post-validations";

export enum PostViewsEnum {
    DESC="DESC",
    ASC="ASC"
}
export class SearchPostDto{
    @IsOptional()
    @IsString()
    query?:string
    views?:PostViewsEnum
    @IsOptional()
    @IsNumberString()
    ratingFrom?:number
    @IsOptional()
    @IsNumberString()
    ratingTo?:number
    @IsOptional()
    @IsNumberString()
    page?:number
    @IsOptional()
    @IsNumberString()
    take?:number
    @IsOptional()
    @IsString()
    tags?:string
    @IsOptional()
    type?:"popular" | "new"
    @IsOptional()
    @IsNumberString()
    authorId?:number
    @IsOptional()
    @IsBooleanString()
    isBookmarks?:boolean
    @IsOptional()
    @IsString()
    searchBy?:"OnlyForTitle" | "OnlyForDescription" | "ForTitleAndDescription"
    @IsOptional()
    @IsBooleanString()
    exactMatch?:string
}
