import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { QnaService } from './qna.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CreateQnaMappingDto } from './dto/create-qna-mapping.dto';

@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  // ── Questions ──────────────────────────────────────────────────────────────

  @Post('questions')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.qnaService.createQuestion(dto);
  }

  @Get('questions')
  findAllQuestions() {
    return this.qnaService.findAllQuestions();
  }

  @Get('questions/:id')
  findOneQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.qnaService.findOneQuestion(id);
  }

  @Patch('questions/:id')
  updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.qnaService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  removeQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.qnaService.removeQuestion(id);
  }

  // ── Answers ────────────────────────────────────────────────────────────────

  @Post('answers')
  createAnswer(@Body() dto: CreateAnswerDto) {
    return this.qnaService.createAnswer(dto);
  }

  @Get('answers')
  findAllAnswers() {
    return this.qnaService.findAllAnswers();
  }

  @Get('answers/:id')
  findOneAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.qnaService.findOneAnswer(id);
  }

  @Patch('answers/:id')
  updateAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnswerDto,
  ) {
    return this.qnaService.updateAnswer(id, dto);
  }

  @Delete('answers/:id')
  removeAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.qnaService.removeAnswer(id);
  }

  // ── QnaMappings ────────────────────────────────────────────────────────────

  @Post('mappings')
  createMapping(@Body() dto: CreateQnaMappingDto) {
    return this.qnaService.createMapping(dto);
  }

  @Get('mappings')
  findAllMappings() {
    return this.qnaService.findAllMappings();
  }

  @Get('mappings/:id')
  findOneMapping(@Param('id', ParseIntPipe) id: number) {
    return this.qnaService.findOneMapping(id);
  }

  @Get('mappings/question/:questionId')
  findMappingByQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return this.qnaService.findMappingByQuestion(questionId);
  }

  @Delete('mappings/:id')
  removeMapping(@Param('id', ParseIntPipe) id: number) {
    return this.qnaService.removeMapping(id);
  }
}
