import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {In, IsNull, Repository} from "typeorm";
import {CommentEntity} from "./entities/comment.entity";
import {UserEntity} from "../user/entities/user.entity";
import {SearchDto} from "./dto/search.dto";
import {DISlIKE, LIKE} from "../constants/postConstants/postContacts";
import {UserService} from "../user/user.service";
import {MarksEnum} from "../enum/marksEnum";
@Injectable()
export class CommentService {
  constructor(
      @InjectRepository(CommentEntity)
      private repository:Repository<CommentEntity>,
      @Inject(forwardRef(() => UserService))
      private UserService:UserService
  ){}

   create(dto: CreateCommentDto,user:UserEntity) {
      const createDto={
          post:{id:+dto.postId},
          text:dto.text,
          user,
          parentId:dto.parentId,
          marks:[]
      }
       return  this.repository.save(createDto)
  }

 async findByType(userId:number,itemId:number,type:"user" | "post",searchDto?:SearchDto) {
     const qb=await this.repository.createQueryBuilder("comment").where({
         [type]:{id:itemId},
         parentId: searchDto?.parentId ? searchDto?.parentId : IsNull()
     })
     if (searchDto?.orderBy==='popular' || !searchDto?.orderBy){
         qb.orderBy("comment.rating","DESC")
     }
     if (searchDto?.orderBy==="new"){
         qb.orderBy("comment.createdAt","DESC")
     }
     const take=searchDto?.take || 10
     if (searchDto?.page<=0) searchDto.page=1
     if(!searchDto?.parentId)      qb.take(take)
     qb.skip((searchDto?.page-1)*take || 0)
     qb.leftJoinAndSelect("comment.post","post")
     qb.leftJoinAndSelect("comment.user","user")
     qb.leftJoin("comment.marks","marks").leftJoinAndSelect("marks.user","author")
     qb.select(["comment","user.logo","user.id","user.fullName","post.id","post.title","marks",
     "author.logo","author.fullName","author.id"])
     const [items,total]=await qb.getManyAndCount()
     return   {
         items: total>0 ? await Promise.all(items.map(async item=>{
             const answers= await this.findByType(userId,itemId,type,{...searchDto,parentId:item.id})
             const isLiked=!!item.marks.find(mark=>mark.user.id===userId && mark.type===LIKE)
             const isDisLiked=!!item.marks.find(mark=>mark.user.id===userId && mark.type===DISlIKE  )
             return   {...item,isLiked,isDisLiked,answers}
         })):items,
         total
     }
 }
 async update(id: number,userId:number, dto: UpdateCommentDto) {
     const find=await this.repository.findOne({where:{id},relations:["user"]});
    if (!find) throw new NotFoundException("Comment was not found")
     if (find.user?.id!==userId) throw new BadRequestException("You can't update this comment")
    return this.repository.update(id,{text:dto.text});
  }
    async remove(id: number,userId:number) {
    const find=await this.repository.findOne({where:{id},
        relations:["user","marks"]});
    if (!find) throw new NotFoundException("Comment was not found")
        if (find.user.id!==userId) throw new BadRequestException("You can't remove this comment")
        const updatedEntity=await this.repository.preload({
            id:id,
            marks:[],
        })
        await this.repository.save(updatedEntity)
        await this.removeAnswers(id)
        return this.repository.delete(id);
  }
  async removePostComments(postId:number){
      const comments=await this.repository.find({
          where:{post:{id:postId}},
          relations:["post"]
      })
      comments.forEach(async comment=>{
          await this.removeAnswers(comment.id)
      })
      const newArr=comments.map(comment=>({...comment,marks:[]}))
      await this.repository.save(newArr);
      return  await this.repository.delete({
          post:In([postId])
      })
  }
  async removeAnswers(parentId:number){
     const comments=await this.repository.find({
         where:{
             parentId
         },
         relations:["marks"]
     })
      if (comments.length){
          const newArr=comments.map(comment=>({...comment,marks:[]}))
          await this.repository.save(newArr);
          for (const comment of comments) {
              await this.removeAnswers(comment.id)
          }
          return  await this.repository.delete({
              parentId:In([parentId])
          })
      }

  }
    async  likeOrDislikeComment(commentId:number,userId:number,type:MarksEnum){
        const comment= await this.repository.findOne({
            where:{
                id:commentId
            },
            relations:["user","marks","marks.user"],
                    })
        if (!comment)  throw new  NotFoundException("Comment was not found")
        if (comment.user.id===userId){
            throw new ForbiddenException(`User can't ${type} himself`)
        }
        let isTypeChanged:boolean=false;
        comment?.marks?.forEach(mark=>{
            if (mark?.user?.id===userId){
                if (mark.type!==type){
                    isTypeChanged=true
                }
                else {
                    throw new ForbiddenException(`User can't ${type} more than once`)
                }
            }
        })
        const rating=isTypeChanged ? type===DISlIKE ?
            comment.rating-2:comment.rating+2:type===LIKE ?
            comment.rating+1:comment.rating-1
        const marks=isTypeChanged ? comment.marks.map(mark=>{
            if (mark?.user?.id===userId){
                return {...mark,type:mark.type===LIKE ? DISlIKE:LIKE }
            }
            return mark
        }):[...comment.marks,{user:{id:userId},type,comment:{id:comment.id}}]
        const updatedEntity=await this.repository.preload({
            id:commentId,
            marks,
            rating:rating
        })
        await this.repository.save(updatedEntity)
        const updatedPost= await this.repository.findOne({
            where:{
                id:commentId
            },
            relations:["user","marks","marks.user"],
        })
        await this.UserService.updateUserRating(comment.user.id,type)
        return  {
            id:commentId,
            marks:updatedPost.marks,
            rating:updatedPost.rating
        }
    }
    async deleteMark(commentId:number,userId:number){
        const comment= await this.repository.findOne({
            where:{
                id:commentId
            },
            relations:["user","marks","marks.user"]
        })
        if (!comment)  throw new  NotFoundException("Comment was not found")
        if (comment.user.id===userId){
            throw new ForbiddenException(`User can't delete mark in himself`)
        }
        const mark=comment.marks.find(mark=>mark?.user?.id===userId)
                const updatedEntity=await this.repository.preload({
                    id:commentId,
                    rating:mark?.type==="like" ? comment.rating-1:comment.rating+1,
                    marks:comment?.marks?.filter(mark=>mark.user.id!==userId)
                })
     return    await this.repository.save(updatedEntity)

    }
}
