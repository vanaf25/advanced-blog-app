import { PartialType } from '@nestjs/mapped-types';
import {IsEmail, Length} from "class-validator";
class UserDto{
    @Length(3,32,{message:"Name must have minimum 3 characters and maximum 26"})
    fullName:string
    @IsEmail(undefined,{message:"Email isn't correct"})
    email:string;
}
export class UpdateUserDto extends PartialType(UserDto) {
    logo?:any
    description?:string
}
