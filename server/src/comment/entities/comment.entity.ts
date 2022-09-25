import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable, ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {PostEntity} from "../../post/entities/post.entity";
import {CommentMarkEntity} from "./comment-mark.entity";
@Entity("comments")
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    text: string;
    @CreateDateColumn({type:"timestamp"})
    createdAt:Date
    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date
    @ManyToOne(()=>UserEntity,{
        nullable:false
    })
    @JoinColumn({name:"userId"})
    user:UserEntity
    @ManyToOne(()=>PostEntity,{
        nullable:false
    })
    @JoinColumn({name:"postId"})
    post:PostEntity
    @Column({nullable:true})
    parentId:number
    @Column({default:0})
    rating:number
   @OneToMany(()=>CommentMarkEntity,mark=>mark.comment,
       {cascade:true})
    marks:CommentMarkEntity[]
}
