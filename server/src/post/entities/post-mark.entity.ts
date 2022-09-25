import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {PostEntity} from "./post.entity";
@Entity("post-mark")
export class PostMarkEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>UserEntity,user=>({id:user.id,
        fullName:user.fullName,logo:user.fullName}))
    @JoinColumn()
     user:UserEntity;
    @ManyToOne(()=>PostEntity,post=>post)
    @JoinColumn()
     post:PostEntity;
    @Column()
    type:string
}
