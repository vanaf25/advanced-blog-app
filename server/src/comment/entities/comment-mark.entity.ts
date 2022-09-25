import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {CommentEntity} from "./comment.entity";

@Entity("comment-mark")
export class CommentMarkEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>UserEntity,user=>({id:user.id,
        fullName:user.fullName,logo:user.fullName}))
    @JoinColumn()
     user:UserEntity;
    @ManyToOne(()=>CommentEntity,comment=>comment)
    @JoinColumn()
     comment:CommentEntity;
    @Column()
    type:string
}
