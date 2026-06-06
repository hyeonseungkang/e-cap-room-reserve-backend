import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { Answer } from './entity/answer.entity';
import { QnaMapping } from './entity/qna-mapping.entity';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer, QnaMapping])],
  providers: [QnaService],
  controllers: [QnaController],
  exports: [QnaService],
})
export class QnaModule {}
