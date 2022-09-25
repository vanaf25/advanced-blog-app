import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  UseInterceptors, UploadedFile, Response, StreamableFile
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guards";
import {SearchUserDto} from "./dto/search-user.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import { join } from 'path';
import {SharpPipe} from "./pipe/sharp.pipe";
import {User} from "../decorators/user.decorator";
import {SearchDto} from "../comment/dto/search.dto";
import {HeaderImagePipeSharpPipe} from "./pipe/headerImage.pipe";
import {paramIdDto} from "../post/dto/param-id.to";
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(@Query() query:SearchUserDto) {
    return this.userService.findAll(query);
  }
  @UseGuards(JwtAuthGuard)
  @Post(`/repost/:id`)
  rePost(@Param() {id}:paramIdDto, @User("id") userId:number){

  }
  @Patch('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  update(@Body() updateUserDto: UpdateUserDto,@User("id") userId, @UploadedFile(SharpPipe) filename: string) {
    return this.userService.update(+userId, {...updateUserDto,logo:filename});
  }
  @Get("avatar/:imageName")
  getFile(@Response() res, @Param() {imageName}): StreamableFile {
    return res.sendFile(
        join(process.cwd(),`src/images/avatars/${imageName}`)
    )
  }
  @Get("headerImages/:imageName")
  getHeaderImage(@Response() res, @Param() {imageName}): StreamableFile {
    return res.sendFile(
        join(process.cwd(),`src/images/headersImages/${imageName}`)
    )
  }
  @Get("comments/:id")
  getUserComments(@Param() {id}:paramIdDto, @User("id") userId,@Query() query:SearchDto ){
      return this.userService.getUserComments(+id,userId,query)
  }
  @Get("posts/:id")
  getUserPosts(@Param() {id}:paramIdDto){
    return this.userService.getUserPosts(+id)
  }
  @Patch("uploadHeaderImage")
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  uploadHeaderImage(@User("id") id:number,  @UploadedFile(HeaderImagePipeSharpPipe) filename: string){
    return this.userService.uploadImage(id, filename)
  }
  @Get(':id')
  findOne(@Param() {id}: paramIdDto) {
    return this.userService.findById(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch("sendActivationCode")
  sendActivationCode(@User("id") userId:number){
    return this.userService.reSendActivationCode(userId)
  }
}
