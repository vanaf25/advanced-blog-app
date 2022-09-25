import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MarkEntity} from "./entities/mark.entity";
import {SearchMarkDto} from "./dto/search-mark.dto";

@Injectable()
export class MarksService {
  constructor(
      @InjectRepository(MarkEntity)
      private repository:Repository<MarkEntity>
  ){}
 async findAll(itemId:number,query:SearchMarkDto){
    const qb=await this.repository.createQueryBuilder("mark")
    qb.leftJoinAndSelect("mark.user","user");
    qb.leftJoinAndSelect(`mark.${query.type}`,`${query.type}`)
        .where(`${query.type}.id= :id`,{id:itemId})
     qb.select([
         "mark","user.id","user.logo","user.fullName"
     ])
     const take=query.take || 2
     qb.take(take)
     if (query.page<=0) query.page=1
     if (!query.page) query.page=1
     qb.skip((query?.page-1)*take || 0)
     const [items,total]=await qb.getManyAndCount()
     return {
         items,
         total
     }
 }
  create(createMarkDto: CreateMarkDto,user:any) {
    if (createMarkDto.commentId && createMarkDto.postId) throw new ForbiddenException("You can't create for post and marks simultaneously")
   return  this.repository.save({
     type:createMarkDto.type,
     user,
     post:{id:createMarkDto.postId || null},
     comment:{id:createMarkDto.commentId || null}
   })
  }

 async update(id: number,userId:number,updateMarkDto: UpdateMarkDto) {
    const mark=await this.repository.findOne({
      where:{id},
      relations:["user"]
    })
    if (!mark) throw new NotFoundException("Mark not found")
    if (mark.user.id!==userId) throw  new BadRequestException("You can't remove this mark")
    return this.repository.update(id,updateMarkDto)
  }

 async remove(id: number,userId:number) {
    const mark=await this.repository.findOne({
      where:{id},
      relations:["user"]
    })
   if (!mark) throw new NotFoundException("Mark not found")
   if (mark.user.id!==userId) throw  new BadRequestException("You can't remove this mark")
    return this.repository.delete(id)
  }
}
