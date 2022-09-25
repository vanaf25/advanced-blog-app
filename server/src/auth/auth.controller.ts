import {Controller, Post, UseGuards, Get, Body, Param, Redirect} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "./guards/jwt-auth-guards";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {User} from "../decorators/user.decorator";
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post("login")
  async auth(@User() user){
    return  this.authService.login(user)
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
 async getProfile(@User() user) {
    return await this.authService.getProfile(user.id);
  }
  @Post("registration")
  registration(@Body() body:CreateUserDto){
    return this.authService.registration(body)
  }
    @Redirect(process.env.CLIENT_URL,301)
  @Get('activation/:activationLink')
   async activateAccount(@Param("activationLink") activationLink:string){
      await this.authService.activateAccount(activationLink)
  }
}
