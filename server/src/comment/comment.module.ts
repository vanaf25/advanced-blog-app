import {forwardRef, Module} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity} from "./entities/comment.entity";
import {CommentMarkEntity} from "./entities/comment-mark.entity";
import {UserModule} from "../user/user.module";
@Module({
  imports:[TypeOrmModule.forFeature([CommentEntity,CommentMarkEntity]),
    forwardRef(() => UserModule)],
  controllers: [CommentController],
  providers: [CommentService],
  exports:[CommentService]
})
export class CommentModule {}
