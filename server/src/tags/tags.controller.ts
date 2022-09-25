import {Controller, Get, Query} from '@nestjs/common';
import { TagsService } from './tags.service';
import {SearchTagDto} from "./dto/search-tag.to";
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get()
  findAll(@Query() query:SearchTagDto) {
    return this.tagsService.findAll(query);
  }
}
