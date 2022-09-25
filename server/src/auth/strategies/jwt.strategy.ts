import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PayloadUserType} from "../types/types";
import {UserService} from "../../user/user.service";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService:UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY,
            passReqToCallback: true

        });
    }

    async validate(request: Request,payload:PayloadUserType) {
        const data={id: payload.sub, fullName: payload.fullName,logo:payload.logo}
        const user=await this.userService.findByCondition({
            where:data
        })
        if (!request.url.includes("auth") && !request.url.includes("users/sendActivationCode")){
            if (!user.isActivated){
                throw new BadRequestException("You must activate an account")
            }
        }
        if (!user) throw new UnauthorizedException("Don't access for this page")
        return data;
    }
}
