import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {CommentEntity} from "../../comment/entities/comment.entity";
import {PostEntity} from "../../post/entities/post.entity";

@Entity("marks")
export class MarkEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>UserEntity,user=>({id:user.id,
        fullName:user.fullName,logo:user.fullName}))
    @JoinColumn()
    user:UserEntity;
    @ManyToOne(()=>CommentEntity,comment=>comment)
    @JoinColumn()
    comment:CommentEntity;
    @ManyToOne(()=>PostEntity,post=>post)
    @JoinColumn()
    post:PostEntity;
    @Column()
    type:"like" | "dislike"
}
