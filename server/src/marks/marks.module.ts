import { Module } from '@nestjs/common';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MarkEntity} from './entities/mark.entity'
@Module({
  imports:[TypeOrmModule.forFeature([MarkEntity])],
  controllers: [MarksController],
  providers: [MarksService],
  exports:[MarksService]
})
export class MarksModule {}
