import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guards";
import {User} from "../decorators/user.decorator";
import {SearchMarkDto} from "./dto/search-mark.dto";
@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}
  @Get(":id")
  findMark(@Param("id") id:string, @Query() query:SearchMarkDto ){
    return this.marksService.findAll(+id,query)
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMarkDto: CreateMarkDto,@User() user) {
    return this.marksService.create(createMarkDto,user);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateMarkDto: UpdateMarkDto, @User() user ) {
    return this.marksService.update(+id,user.id,updateMarkDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @User() user) {
    return this.marksService.remove(+id,user.id);
  }
}
