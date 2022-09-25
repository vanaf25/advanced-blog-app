import {forwardRef, Module} from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./entities/post.entity";
import {CommentModule} from "../comment/comment.module";
import {UserModule} from "../user/user.module";
import {PostMarkEntity} from "./entities/post-mark.entity";
import {TagEntity} from "../tags/entities/tag.entity";
import {TagsModule} from "../tags/tags.module";
@Module({
  imports:[TypeOrmModule.forFeature([PostEntity,PostMarkEntity,TagEntity]),CommentModule,
      TagsModule,
    forwardRef(() => UserModule)],
  controllers: [PostController],
  providers: [PostService],
  exports:[PostService]
})
export class PostModule {}
