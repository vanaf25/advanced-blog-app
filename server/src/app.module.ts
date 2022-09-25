import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity} from './user/entities/user.entity'
import { PostModule } from './post/post.module';
import {PostEntity} from "./post/entities/post.entity";
import { CommentModule } from './comment/comment.module';
import {CommentEntity} from "./comment/entities/comment.entity";
import {AuthModule} from "./auth/auth.module";
import { memoryStorage } from 'multer';
import {MulterModule} from "@nestjs/platform-express";
import {CommentMarkEntity} from "./comment/entities/comment-mark.entity";
import {PostMarkEntity} from "./post/entities/post-mark.entity";
import { MarksModule } from './marks/marks.module';
import {MarkEntity} from "./marks/entities/mark.entity";
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import {TagEntity} from "./tags/entities/tag.entity";
@Module({
  imports: [  ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: process.env.POSTGRES_USER as 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT ,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [UserEntity,PostEntity,CommentEntity,CommentMarkEntity,PostMarkEntity,MarkEntity,TagEntity],
    synchronize: true,
  }),UserModule, PostModule, CommentModule, AuthModule,MarksModule,
   MulterModule.register({
    storage: memoryStorage()
  }),
   MarksModule,
   TagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
