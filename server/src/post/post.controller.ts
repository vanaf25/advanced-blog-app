import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {PostService} from './post.service';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {SearchPostDto} from "./dto/search-post.dto";
import {JwtAuthGuard, OptionalAuthGuard} from "../auth/guards/jwt-auth-guards";
import {join} from "path";
import {FileInterceptor} from "@nestjs/platform-express";
import {User} from "../decorators/user.decorator";
import {BookmarksSearchDto} from "../../../client/types/postTypes";
import {MarksEnum} from "../enum/marksEnum";
import {SharpPipe, SharpResolvePipe} from "./pipe/sharp.pipe";
import {paramIdDto} from "./dto/param-id.to";

@Controller('posts')
export class PostController {
  constructor(
      private readonly postService: PostService,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePostDto, @User() user) {
    return this.postService.create({...dto,body:dto.body},user);
  }
  @UseGuards(JwtAuthGuard)
  @Post(`/repost/:id`)
  rePost(@Param("id") id:string, @User("id") userId:number){
  return this.postService.createRePost(+id,userId)
  }
  @Get()
  @UseGuards(OptionalAuthGuard)
  findAll(@Query() query:SearchPostDto,@User() user) {
    return this.postService.findAll(query,user?.id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param() {id}: paramIdDto, @Body() updatePostDto: UpdatePostDto,@User() user) {
    return this.postService.update(+id, updatePostDto,user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param() {id}: paramIdDto,@User() user) {
    return this.postService.remove(+id,user.id);
  }
  @Get("images/:imageName")
  getImage(@Response() res, @Param() {imageName}):  StreamableFile{
    return res.sendFile(
        join(process.cwd(),`src/images/avatars/${imageName}`)
    )
  }
  @UseGuards(JwtAuthGuard)
  @Patch(":id/likePost")
  likePost(@Param() {id} :paramIdDto, @User() user){
    return this.postService.likeOrDislikePost(+id,user.id,MarksEnum.LIKE)
  }
  @UseGuards(JwtAuthGuard)
  @Patch(":id/disLikePost")
  dislikePost(@Param() {id} :paramIdDto, @User() user){
    return this.postService.likeOrDislikePost(+id,user.id,MarksEnum.DISlIKE)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(":id/deleteMark")
  deleteMark(@Param() {id}:paramIdDto, @User() user){
    return this.postService.deleteMark(user?.id,+id);
  }
  @Post("/image")
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile(SharpPipe) resolvePipe: SharpResolvePipe){
    return  Promise.resolve({
      success : 1,
      file: {
        url :`http://localhost:5000/posts/images/${resolvePipe.filename || null} `,
        width:resolvePipe.width,
        height:resolvePipe.height
      }
    })
  }
  @UseGuards(JwtAuthGuard)
  @Post("/bookmarks")
  async addBookmark(@Body() dto:{postId:number},@User() user){
    return  this.postService.createBookmark(dto.postId,user.id)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(`/bookmarks/:id`)
  async deleteBookmark(@Param() {id}:paramIdDto,@User() user ){
    return this.postService.deleteBookmark(+id,user.id)
  }
  @UseGuards(JwtAuthGuard)
  @Get("/bookmarks")
  async getBookmarks(@User() user, @Query() dto:BookmarksSearchDto ) {
    return this.postService.findAll(dto,user.id,true)
  }
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  findOne( @Param()  {id}:paramIdDto , @User() user) {
    return this.postService.findOne(+id,user?.id);
  }
}
