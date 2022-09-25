import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {AuthService} from "../auth.service";
import {JwtService} from "@nestjs/jwt";
import {UserEntity} from "../../user/entities/user.entity";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService,  private jwtService: JwtService) {
        super({usernameField:"login",passwordField:"password"});
    }

    async validate(login: string, password: string): Promise<any> {
        const user = await this.authService.validateUser({login, password});
        if (!user) {
            throw new UnauthorizedException("Login or password are incorrect");
        }
        return user;
    }
    async login(user: UserEntity) {
        const payload = { username: user.fullName,sub: user.id,logo:user.logo,isActivated:user.isActivated };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
