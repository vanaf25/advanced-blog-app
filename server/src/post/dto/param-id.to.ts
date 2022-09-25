import {IsNumberString} from "class-validator";

export class paramIdDto{
    @IsNumberString()
        id:string
}
