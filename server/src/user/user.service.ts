import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Redirect} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserEntity} from "./entities/user.entity";
import {FindOneOptions, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {SearchUserDto} from "./dto/search-user.dto";
import {PostService} from "../post/post.service";
import {CommentService} from "../comment/comment.service";
import {SearchDto} from "../comment/dto/search.dto";
import {MarksEnum} from "../enum/marksEnum";
import MailService from "../mail/mail.service";
import {v4} from "uuid";
@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      private usersRepository:Repository<UserEntity>,
      @Inject(forwardRef(() => PostService))
      private postService:PostService,
      @Inject(forwardRef(() => CommentService))
      private commentsService:CommentService,
      private MailService:MailService
  ){}
  async create(dto: CreateUserDto & {activatedLink:string}) {
      await this.MailService.sendActivationMail(dto.email,dto.fullName,dto.activatedLink)
    return this.usersRepository.save(dto);
  }
 async findById(id: number) {
      const user= await this.usersRepository.findOne({where:{id}});
      if (!user) throw new NotFoundException("The user was not Found")
     const {password,activatedLink,...userData}=user
    return  {...userData}
  }
  async getSimpleUser(id:number){
      return await this.usersRepository.createQueryBuilder("u").where("u.id=:id",{id})
          .select(["u.id","u.logo","u.fullName","u.isActivated"]).getOne()
  }
  async findByCondition(condition:FindOneOptions<UserEntity>){
    return this.usersRepository.findOne(condition)
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
      if (updateUserDto.email){
          const foundEmail=await this.usersRepository.findOne({
              where:{
                  email:updateUserDto.email
              }
          })
          if (foundEmail && ( foundEmail.email!==updateUserDto.email
              || foundEmail.id!==id)){
              throw new BadRequestException("This email is already use")
          }
      }
      if (updateUserDto.fullName){
          const foundFullName=await this.usersRepository.findOne({
              where:{
                  fullName:updateUserDto.fullName
              }
          })
          if (foundFullName && ( foundFullName.fullName!==updateUserDto.fullName || foundFullName.id!==id)){
              throw new BadRequestException("This fullName is already use")
          }
      }
      if (updateUserDto.logo) updateUserDto.logo=`http://localhost:5000/users/avatar/${updateUserDto.logo}`
    return this.usersRepository.update(id,{
        description:updateUserDto.description,
        logo:updateUserDto.logo,
        fullName:updateUserDto.fullName,
        email:updateUserDto.email
    })
  }
 async findAll(dto:SearchUserDto){
    const qb=this.usersRepository.createQueryBuilder('u');
    const take=dto.take || 10
     qb.take(take)
     if (dto?.page<=0) dto.page=1
     qb.skip((dto?.page-1)*take || 0)
     if (dto.fullName){
      qb.andWhere(`u.fullName ILIKE :fullName`)
    }
     qb.orderBy("u.rating","DESC")
     qb.setParameters({
      fullName:`%${dto.fullName}%`,
    })
     qb.select(["u.id","u.fullName","u.logo","u.rating"])
    const [items,total]=await qb.getManyAndCount()
    return  {
      items,
      total
    }
  }
  getUserComments(id:number,userId,query?:SearchDto){
      return this.commentsService.findByType(userId,id, "user",query)
  }
async  getUserPosts(id:number){
      const user=await this.usersRepository.findOne({where:{id},relations:["rePosts"]})
    if (!user) throw new NotFoundException("User was not Found")
      return  this.postService.findAll({authorId:id});
  }
  async createBookmark(userId:number,postId:number){
      const post=await this.usersRepository.findOne({where:{id:userId},
          relations:["bookmarks","bookmarks.author"]})
      const updatedEntity=await this.usersRepository.preload({
          id:userId,
          bookmarks:[...post.bookmarks,{id:postId}]
      })
     return  await this.usersRepository.save(updatedEntity)
  }
  async deleteBookmark(userId:number,postId:number){
      const post=await this.usersRepository.findOne({where:{id:userId},
          relations:["bookmarks"]})
      const updatedEntity=await this.usersRepository.preload({
          id:userId,
          bookmarks:post.bookmarks.filter(bookmark=>bookmark.id!==postId)
      })
      return  await this.usersRepository.save(updatedEntity)
  }
  async updateUserRating(userId:number,type:MarksEnum){
    const user=await this.usersRepository.findOne({
        where:{
            id:userId
        }
    })
      if (!user) throw new NotFoundException("User was not found")
      return  this.usersRepository.update(userId,{
          rating:type==="like" ? user.rating+1:user.rating-1
      })
  }
  async uploadImage(id:number,filename:string){
       await this.usersRepository.update(id,{
          headerImage:filename
      })
      return filename
  }
  async activateAccount(activatedLink:string){
    const user=await this.usersRepository.findOne({where:{activatedLink}})
      if (user.isActivated) throw new Error("You can't activate account more than once time")
      if (!user) throw new Error("Link is not correctly")
      user.isActivated=true
      return  await this.usersRepository.save(user)
  }
  async reSendActivationCode(userId:number){
      const user=await this.usersRepository.findOne({where:{id:userId}})
      if (!user) throw new Error("User was not defined")
      if (user.isActivated) throw new Error("User can't activate account more than once")
      const activationCode=v4();
      user.activatedLink=activationCode
      await  this.MailService.sendActivationMail(user.email,user.fullName,activationCode)
     return  await this.usersRepository.save(user)
  }
  async createRePost(userId:number,postId:number){

  }
}
