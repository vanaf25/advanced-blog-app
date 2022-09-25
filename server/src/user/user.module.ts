import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {PostModule} from "../post/post.module";
import {CommentModule} from "../comment/comment.module";
import {MailModule} from "../mail/mail.module";
@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),forwardRef(() => PostModule),
    forwardRef(() => CommentModule),MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
