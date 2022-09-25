import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn, ManyToOne, ManyToMany, JoinTable, OneToMany
} from 'typeorm';
import {UserEntity} from "../../user/entities/user.entity";
import {PostMarkEntity} from "./post-mark.entity";
import {TagEntity} from "../../tags/entities/tag.entity";
import {CommentEntity} from "../../comment/entities/comment.entity";
@Entity("posts")
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column('jsonb',{nullable:true})
    body:any[]
    @CreateDateColumn({type:"timestamp"})
    createdAt:Date
    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date
    @Column({nullable:true})
    description:string
    @Column("jsonb",{nullable:true})
    firstImage:string | null
    @Column({
        default:0
    })
    views:number
    @ManyToOne(type =>UserEntity,{
        nullable:true,
    }) @JoinColumn({
        name:"authorId"
    })
    author:UserEntity
    @Column({default:0})
    rating:number
    @ManyToMany(type=>UserEntity,user=>user.id)
    @JoinTable({
        inverseJoinColumn:{
            name:'userId',
            referencedColumnName:"id"
        },
        joinColumn:{
            name:"postId",
            referencedColumnName:"id"
        },
        name:"bookmarks"
    })
    bookmarkUsers:UserEntity[]
    @OneToMany(()=>PostMarkEntity,mark=>mark.post,
        {cascade:true})
    marks:PostMarkEntity[]
   @OneToMany(()=>TagEntity,tag=>tag.post,{cascade:true})
    tags:TagEntity[]
    @ManyToMany(type=>UserEntity,user=>user.id)
    @JoinTable({
        inverseJoinColumn:{
            name:'userId',
            referencedColumnName:"id"
        },
        joinColumn:{
            name:"postId",
            referencedColumnName:"id"
        },
        name:"re-Posts"
    })
    rePosts:UserEntity[]
    @OneToMany(()=>CommentEntity,comment=>comment.post,{cascade:true})
    comments:CommentEntity[]
}
