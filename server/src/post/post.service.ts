import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "./entities/post.entity";
import {SearchPostDto} from "./dto/search-post.dto";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {CommentService} from "../comment/comment.service";
import {UserService} from "../user/user.service";
import {DISlIKE, LIKE} from "../constants/postConstants/postContacts";
import {MarksEnum} from "../enum/marksEnum";
@Injectable()
export class PostService {
  constructor(
      @InjectRepository(PostEntity)
      private readonly repository:Repository<PostEntity>,
      private CommentService:CommentService,
      @Inject(forwardRef(() => UserService))
      private readonly UserService:UserService,
  ){}
 async create(dto: CreatePostDto,user:CreateUserDto) {
      let description=dto.body?.find((obj)=>obj.type==="paragraph")
      if(description) description=description?.data?.text
      const firstImage=dto.body.find(obj=>obj.type==="image");
    const createdPost= await this.repository.save({
        title:dto.title,
        body:dto.body,
        tags:[],
        author:user,
        description:description || "",
        firstImage:firstImage || null
    });
    const post=await this.repository.findOne({where:{id:createdPost.id},relations:["tags"]})
     const tags=[...new Set(dto.tags)]
     // @ts-ignore
     post.tags=tags.map(tag=>({text:tag.text,post:{id:post.id}}))
  return   await this.repository.save(post)
  }
  async findAll(dto:SearchPostDto,userId?:number,isBookmarks?:boolean){
      const qb=await this.repository.createQueryBuilder('p').where(dto.authorId ? {
        author:dto.authorId,
    }:{});
      const take=dto.take || 4
      qb.leftJoinAndSelect("p.author","author");
      qb.leftJoinAndSelect("p.marks","marks")
          .leftJoinAndSelect("marks.user", "markAuthor")
      qb.leftJoinAndSelect("p.tags","tags")
     qb.leftJoin("p.rePosts","rePosts").loadRelationCountAndMap("rePosts.countOfRePosts","p.rePosts")
      qb.leftJoin("p.comments","comments").loadRelationCountAndMap("comments.countOfComments","p.comments")
      if ((dto.isBookmarks || isBookmarks) && userId){
          qb.leftJoinAndSelect("p.bookmarkUsers","bookmark")
              .where(`bookmark.id= :id`,{id:userId})
      }
      else{
          qb.leftJoinAndSelect("p.bookmarkUsers","bookmark");
          if (dto.type==="popular" || !dto.type || dto.type!=="new" ){
              qb.orderBy("p.rating","DESC")
          }
          if (dto.type==="new"){
              qb.orderBy("p.createdAt","DESC")
          }
          if (dto.query){
              const exactMatch=dto.exactMatch && JSON.parse(dto.exactMatch)
              if (exactMatch){
                  if (dto?.searchBy==="OnlyForTitle" || !dto.searchBy ){
                      qb.andWhere(`p.title = :title`,{title:dto.query})
                  }
                  else if (dto?.searchBy==="OnlyForDescription"){
                      qb.andWhere(`p.description = :title`,{title:dto.query})
                  }
                  else if (dto?.searchBy==="ForTitleAndDescription"){
                      qb.andWhere(`p.description = :title OR p.title = :title `,{title:dto.query})
                  }
                  else   qb.andWhere(`p.title = :title`,{title:dto.query})
              }
              else {
                  if (dto?.searchBy==="OnlyForTitle" || !dto.searchBy ){
                      qb.andWhere(`p.title ILIKE :title`)
                  }
                  else if (dto?.searchBy==="OnlyForDescription"){
                      qb.andWhere(`p.description ILIKE :title`)
                  }
                  else if (dto?.searchBy==="ForTitleAndDescription"){
                      qb.andWhere(`p.description ILIKE :title OR p.title ILIKE :title `)
                  }
                  else        qb.andWhere(`p.title ILIKE :title`)
                  const parameters={
                      title:`%${dto.query}%`,
                  }
                  qb.setParameters(parameters)
              }
          }
          const tags=dto?.tags && JSON.parse(dto.tags)
          if (tags?.length){
              qb.andWhere("tags.text IN (:...tags)",{tags})
          }
          if (dto.ratingFrom && (!dto.ratingTo || dto.ratingFrom<=dto.ratingTo )){
            qb.andWhere(`p.rating >= ${dto.ratingFrom} `)
          }
          if (dto.ratingTo && (!dto.ratingFrom || dto.ratingFrom<=dto.ratingTo )){
              qb.andWhere(`p.rating <= ${dto.ratingTo} `)
          }
      }
      qb.select(['p','author.id','author.logo',
          'author.fullName',"author.isActivated", "bookmark.id","bookmark.logo","bookmark.fullName","bookmark.isActivated",
          "marks","markAuthor.id","markAuthor.fullName","markAuthor.logo","tags"])
      if (dto?.page<=0) dto.page=1
      qb.take(take)
      qb.skip((dto?.page-1)*take || 0)
      const [items,total]=await qb.getManyAndCount()
      return  {
          items:items.map(item=>{
              const tags=item.tags.map(tag=>tag.text)
              const isLiked=!!item?.marks?.find(mark=>mark.type===LIKE
                  && mark.user.id===userId)
              const isDisLiked=!!item?.marks?.find(mark=>mark.type===DISlIKE
                  && mark.user.id===userId)
              const myBookmark=item?.bookmarkUsers?.filter(user=>user.id===userId)
              if (myBookmark?.length){
                  return {...item,isLiked,isDisLiked,tags,isBookmark:true,bookmarkUsers:undefined}
              }
        return {...item,isLiked,isDisLiked,tags,bookmarkUsers:undefined}
          }),
          total
      }
  }
   async findOne  (id: number,userId:number) {
    const qb=await this.repository.createQueryBuilder('posts');
    qb.whereInIds(id).update().set({
        views:()=>`views+1`
    }).execute()
       qb.leftJoinAndSelect("posts.bookmarkUsers","bookmarks")
       qb.leftJoinAndSelect("posts.marks","marks")
           .leftJoinAndSelect("marks.user","markAuthor")
       qb.leftJoinAndSelect("posts.author","author")
       qb.leftJoinAndSelect("posts.tags","tags")
       qb.leftJoin("posts.rePosts","rePosts")
           .loadRelationCountAndMap("rePosts.countOfRePosts","posts.rePosts")
       qb.leftJoin("posts.comments","comments")
           .loadRelationCountAndMap("comments.countOfComments","posts.comments")
       qb.select([
           "posts",
           "bookmarks.id","bookmarks.logo","bookmarks.fullName",
           "marks",
           "markAuthor.id","markAuthor.logo","markAuthor.fullName",
           "author.id","author.logo","author.fullName",
           "tags"
       ])
       const query=await qb.whereInIds(id).getOne()
       if (!query){
           throw new  NotFoundException("Post was not found")
       }
    const comments=await this.CommentService.findByType(userId,id,"post")
       const isBookmark=!!query?.bookmarkUsers?.find(user=>user?.id===userId);
       const isLiked=!!query?.marks?.find(mark=>mark.type===LIKE
           && mark.user.id===userId)
       const isDisLiked=!!query?.marks?.find(mark=>mark.type===DISlIKE
           && mark.user.id===userId)
       const tags=query.tags.map(tag=>tag.text)
       return  {...query,isLiked,isDisLiked,tags,isBookmark,comments,bookmarkUsers:undefined};
  }
  async update(id: number, dto: UpdatePostDto,userId:number) {
    const find=await this.repository.findOne({
        where:{id},
        relations:["author","tags"]
    })
    if (!find){
      throw new  NotFoundException("Post was not found")
    }
    if (find.author.id!==userId){
        throw new BadRequestException("You can't update this post")
    }
      let description=dto.body.find((obj)=>obj.type==="paragraph")
      if(description) description=description?.data?.text
      const firstImage=dto.body.find(obj=>obj.type==="image");
      const tags=[...new Set(dto.tags)]
      console.log('id',id);
      const preload=await this.repository.preload({
            id,
          body:dto.body,
          description:description ||  "",
          title:dto.title,
          firstImage:firstImage || null,
          tags:tags.map(tag=>({text:tag,post:{id}}))
      })
      return await this.repository.save(preload)
  }

 async remove(id: number,userId:number) {
    const find=await this.repository.findOne({where:{id},relations:["author","marks","tags"]})
   if (!find)       throw new  NotFoundException("Post was not found")
     if (find?.author?.id!==userId) throw new BadRequestException("You can't delete this post")
     if (find.marks.length){
         const newArr={...find,marks:[],tags:[]}
         await this.repository.save(newArr);
     }
     await this.CommentService.removePostComments(id)
   return this.repository.delete(id);
  }
 async getUserPosts(userId:number){
      return  this.repository.find({
          where:{
              author:{id:userId}
          },
          relations:["author","rePosts"]
      })
  }
    async  likeOrDislikePost(postId:number,userId:number,type:MarksEnum){
        const post= await this.repository.findOne({
            where:{
                id:postId
            },
            relations:["author","marks","marks.user"],
        })
        if (!post)  throw new  NotFoundException("Comment was not found")
        if (post.author.id===userId){
            throw new ForbiddenException(`User can't ${type} himself`)
        }
        let isTypeChanged:boolean=false;
        post?.marks?.forEach(mark=>{
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
            post.rating-2:post.rating+2:type===LIKE ?
            post.rating+1:post.rating-1
        const marks=isTypeChanged ? post.marks.map(mark=>{
            if (mark?.user?.id===userId){
                return {...mark,type:mark.type===LIKE ? DISlIKE:LIKE }
            }
            return mark
        }):[...post.marks,{user:{id:userId},type,post:{id:postId}}]
        const updatedEntity=await this.repository.preload({
            id:postId,
            marks,
            rating:rating
        })
        await this.repository.save(updatedEntity)
        const updatedPost= await this.repository.findOne({
            where:{
                id:postId
            },
            relations:["author","marks","marks.user"],
        })
        await this.UserService.updateUserRating(post.author.id,type)
        return  {
            id:postId,
            marks:updatedPost.marks,
            rating:updatedPost.rating
        }

    }
  async createBookmark(postId:number,userId:number){
      return this.UserService.createBookmark(userId,postId)
  }
  async deleteBookmark(postId:number,userId:number){
      return  this.UserService.deleteBookmark(userId,postId)
  }
 async deleteMark(userId:number,postId:number){
     const post= await this.repository.findOne({
         where:{
             id:postId
         },
         relations:["author","marks","marks.user"],
     })
     if (!post)  throw new  NotFoundException("Comment was not found")
     const deletingMark=post.marks.find(mark=>mark.user.id===userId)
     const updatedEntity=await this.repository.preload({
         id:postId,
         marks:post.marks.filter(mark=>mark.user.id!==userId),
         rating:deletingMark?.type===LIKE ? post.rating-1:post.rating+1
     })
        await this.UserService.updateUserRating(post.author.id,deletingMark.type===MarksEnum.LIKE ?MarksEnum.DISlIKE:MarksEnum.LIKE   as MarksEnum)
     return   await this.repository.save(updatedEntity)
 }
 async createRePost(postId:number,userId:number){
      const post=await this.repository.findOne({
          where:{id:postId},
          relations:["rePosts","author","rePosts.rePosts"]
      })
     if (!post) throw new NotFoundException("The Post was not found")
     if(post.author.id===userId) throw new BadRequestException("User can't create re-post with own post")
     post.rePosts.forEach(user=>{
         if (user.id===userId){
        user?.rePosts?.forEach(myRePost=>{
            if (myRePost.id===postId) throw new BadRequestException("User can't re-post one post more than once ")
        })
         }

     })
     const updatedEntity=await this.repository.preload({
         id:postId,
         rePosts:[...post.rePosts,{id:userId}]
     })
      await this.repository.save(updatedEntity)
     return  await this.repository.update(postId,{})
 }
}
