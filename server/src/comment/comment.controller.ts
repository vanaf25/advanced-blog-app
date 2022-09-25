import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards} from '@nestjs/common';
import {CommentService} from './comment.service';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from './dto/update-comment.dto';
import {JwtAuthGuard, OptionalAuthGuard} from "../auth/guards/jwt-auth-guards";
import {User} from "../decorators/user.decorator";
import {SearchDto} from "./dto/search.dto";
import {MarksEnum} from "../enum/marksEnum";

@Controller('comments')
export class CommentController{
    constructor(private readonly commentService: CommentService) {}
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
        return this.commentService.create(createCommentDto,req.user);
    }
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() dto: UpdateCommentDto,@User() user) {
        return this.commentService.update(+id,user.id,dto);
    }
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string ,@User() user) {
        return this.commentService.remove(+id,user.id);
    }
    @Patch(":id/likeComment")
    @UseGuards(JwtAuthGuard)
    likeComment(@Param("id") id :string, @User() user){
        return this.commentService.likeOrDislikeComment(+id,user.id,MarksEnum.LIKE)
    }
    @UseGuards(JwtAuthGuard)
    @Patch(":id/disLikeComment")
    dislikeComment(@Param("id") id :string, @User() user){
        return this.commentService.likeOrDislikeComment(+id,user.id,MarksEnum.DISlIKE)
    }
    @UseGuards(JwtAuthGuard)
    @Delete(":id/deleteMark")
    deleteMark(@Param("id") id:string,@User() user){
        return this.commentService.deleteMark(+id,user?.id)
    }
    @UseGuards(OptionalAuthGuard)
    @Get(`:id/`)
    getComments(@Param("id") id:string, @User() user,@Query() query:SearchDto){
        return this.commentService.findByType(user.id,+id,query.type,query)
    }
}
