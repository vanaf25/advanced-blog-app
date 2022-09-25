import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinColumn, JoinTable, OneToMany, ManyToOne
} from 'typeorm';
import {PostEntity} from "../../post/entities/post.entity";
@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        unique:true
    })
    fullName: string;
    @Column()
    password:string
    @Column({
        unique:true
    })
    email: string;
    @CreateDateColumn({type:"timestamp"})
    createdAt:Date
    @UpdateDateColumn({type:"timestamp",default:null})
    updatedAt:Date
    @Column({nullable:true})
    logo:string
    @Column({nullable:true})
    description:string
    @Column({default:0})
    rating:number
    @ManyToMany(type=>PostEntity,type=>type)
    @JoinTable({
        inverseJoinColumn:{
            name:"postId",
            referencedColumnName:"id"
        },
        joinColumn:{
            name:'userId',
            referencedColumnName:"id"
        },
        name:"bookmarks"
    })
    bookmarks:PostEntity[]
    @Column({nullable:true})
    headerImage:string
    @Column({default:false})
    isActivated:boolean
    @Column({nullable:true})
    activatedLink:string
    @ManyToMany(type=>PostEntity,post=>post.id)
    @JoinTable({
        inverseJoinColumn:{
            name:'postId',
            referencedColumnName:"id"
        },
        joinColumn:{
            name:"userId",
            referencedColumnName:"id"
        },
        name:"re-Posts"
    })
    rePosts:PostEntity[]
}
@Entity("users")
export class SimpleUserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        unique:true
    })
    fullName: string;
    @Column({nullable:true})
    logo:string
}
