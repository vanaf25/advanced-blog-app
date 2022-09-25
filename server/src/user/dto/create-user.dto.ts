import {IsEmail, Length, Matches} from "class-validator";
export class CreateUserDto {
    @Length(3,32,{message:"fullName must have minimum 3 characters and maximum 26"})
    fullName:string
    @IsEmail(undefined,{message:"Email isn't correct"})
    email:string;
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,26}$/,
        {message:`Password must contain at least minimum eight characters and maximum 26, at least one uppercase letter, one lowercase letter and one number: 
            `})
    password:string
}
