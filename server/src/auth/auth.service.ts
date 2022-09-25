import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import {UserService} from "../user/user.service";
import {UserEntity} from "../user/entities/user.entity";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {SimpleUserType} from "../../../client/types/authTypes";
import {v4} from "uuid";
@Injectable()
export class AuthService {
  constructor(
  private readonly userService:UserService,
  private readonly jwtService: JwtService
){}
  async validateUser(dto:CreateAuthDto){
    const user = await this.userService.findByCondition({where:[{
      fullName:dto.login
      },
        {email:dto.login}
      ]});
    if (user && bcrypt.compare(dto.password,user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async getProfile(userId:number){
    return await this.userService.getSimpleUser(userId)
  }
  async login(dto: UserEntity) {
    const {password,...user}=dto
    return {
      user,
     token: await this.generateJwtToken(dto),
    };
  }
  async generateJwtToken(data:SimpleUserType){
    const payload={sub:data.id,fullName:data.fullName,logo:data.logo,isActivated:data.isActivated}
    return this.jwtService.sign(payload)
  }
  async registration(dto:CreateUserDto){
    const emailUser=await this.userService.findByCondition({
      where:{email:dto.email}
    })
    if (emailUser) throw new BadRequestException("This email already use")
    const nameUser=await this.userService.findByCondition({
      where:{fullName:dto.fullName}
    })
    if (nameUser) throw new BadRequestException("This name already use")
    const hashPassword=await bcrypt.hash(dto.password,10)
    const activatedLink=v4()
  const {id,logo,fullName,isActivated}=await this.userService.create({
    ...dto,
    password:hashPassword,
    activatedLink
  })
    const userData={
      id,logo,fullName,isActivated
    }
    return {
      user:userData,
    token:await this.generateJwtToken(userData)
    }
  }
  async activateAccount(activationLink:string){
    return this.userService.activateAccount(activationLink)
  }
}
