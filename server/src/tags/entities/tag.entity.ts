import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PostEntity} from "../../post/entities/post.entity";
@Entity("tags")
export class TagEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    text:string
    @ManyToOne(()=>PostEntity,post=>post)
    @JoinColumn()
    post:PostEntity
}
