import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entity/question.entity';
import { Answer } from './entity/answer.entity';
import { QnaMapping } from './entity/qna-mapping.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CreateQnaMappingDto } from './dto/create-qna-mapping.dto';
import { User } from '../user/entity/user.entity';
import { Admin } from '../admin/entity/admin.entity';

@Injectable()
export class QnaService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(QnaMapping)
    private readonly mappingRepository: Repository<QnaMapping>,
  ) {}

  // ── Questions ──────────────────────────────────────────────────────────────

  createQuestion(dto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create({
      ...dto,
      user: { user_id: dto.user_id } as User,
    });
    return this.questionRepository.save(question);
  }

  findAllQuestions(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['user'] });
  }

  async findOneQuestion(question_id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { question_id },
      relations: ['user'],
    });
    if (!question) {
      throw new NotFoundException(`Question #${question_id} not found`);
    }
    return question;
  }

  async updateQuestion(
    question_id: number,
    dto: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.findOneQuestion(question_id);
    Object.assign(question, dto);
    return this.questionRepository.save(question);
  }

  async removeQuestion(question_id: number): Promise<void> {
    const result = await this.questionRepository.delete({ question_id });
    if (!result.affected) {
      throw new NotFoundException(`Question #${question_id} not found`);
    }
  }

  // ── Answers ────────────────────────────────────────────────────────────────

  createAnswer(dto: CreateAnswerDto): Promise<Answer> {
    const answer = this.answerRepository.create({
      ...dto,
      admin: { admin_id: dto.admin_id } as Admin,
    });
    return this.answerRepository.save(answer);
  }

  findAllAnswers(): Promise<Answer[]> {
    return this.answerRepository.find({ relations: ['admin'] });
  }

  async findOneAnswer(answer_id: number): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      where: { answer_id },
      relations: ['admin'],
    });
    if (!answer) {
      throw new NotFoundException(`Answer #${answer_id} not found`);
    }
    return answer;
  }

  async updateAnswer(answer_id: number, dto: UpdateAnswerDto): Promise<Answer> {
    const answer = await this.findOneAnswer(answer_id);
    Object.assign(answer, dto);
    return this.answerRepository.save(answer);
  }

  async removeAnswer(answer_id: number): Promise<void> {
    const result = await this.answerRepository.delete({ answer_id });
    if (!result.affected) {
      throw new NotFoundException(`Answer #${answer_id} not found`);
    }
  }

  // ── QnaMappings ────────────────────────────────────────────────────────────

  createMapping(dto: CreateQnaMappingDto): Promise<QnaMapping> {
    const mapping = this.mappingRepository.create({
      question: { question_id: dto.question_id } as Question,
      answer: { answer_id: dto.answer_id } as Answer,
    });
    return this.mappingRepository.save(mapping);
  }

  findAllMappings(): Promise<QnaMapping[]> {
    return this.mappingRepository.find({ relations: ['question', 'answer'] });
  }

  async findOneMapping(mapping_id: number): Promise<QnaMapping> {
    const mapping = await this.mappingRepository.findOne({
      where: { mapping_id },
      relations: ['question', 'answer', 'answer.admin'],
    });
    if (!mapping) {
      throw new NotFoundException(`QnaMapping #${mapping_id} not found`);
    }
    return mapping;
  }

  async findMappingByQuestion(question_id: number): Promise<QnaMapping> {
    const mapping = await this.mappingRepository.findOne({
      where: { question: { question_id } },
      relations: ['question', 'answer', 'answer.admin'],
    });
    if (!mapping) {
      throw new NotFoundException(
        `QnaMapping for Question #${question_id} not found`,
      );
    }
    return mapping;
  }

  async removeMapping(mapping_id: number): Promise<void> {
    const result = await this.mappingRepository.delete({ mapping_id });
    if (!result.affected) {
      throw new NotFoundException(`QnaMapping #${mapping_id} not found`);
    }
  }
}
