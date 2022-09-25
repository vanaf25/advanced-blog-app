import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TagEntity} from "./entities/tag.entity";
import {SearchTagDto} from "./dto/search-tag.to";
@Injectable()
export class TagsService {
  constructor( @InjectRepository(TagEntity)
                   private readonly repository: Repository<TagEntity>) {

  }
  async create({text,postId}: CreateTagDto) {
    return await this.repository.save({text,posts:[{id:postId}]})
  }
 async findAll(query:SearchTagDto) {
      const qb= this.repository.createQueryBuilder("tag")
     qb.select(["tag.text"])
     if (query.tagName){
         qb.andWhere("tag.text ILIKE :tagName")
     }
     const parameters={
         tagName:`%${query.tagName}%`
     }
     qb.setParameters(parameters);
     const items=await qb.getMany()
     return {
         items:[...new Set(items.map(item=>item.text))]};
  }
  /*async findTags(tags:TagEntity[],postId:number){
      const findEdTags=await this.findAll();
      for (const tag of tags) {
          const findedTag=findEdTags.find(findedTag=>findedTag.text===tag.text)
          if (!findedTag){
              await this.create({text:tag.text,postId})
          }
      }
     /!* tags.forEach( async  tag=>{
          const findTag=await this.repository.findOne({
              where:{text:tag.text}
          })
          if (!findTag) await this.create({text:tag.text})
      })*!/
  }*/
}
