import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PenaltyPolicy } from './entity/penalty-policy.entity';
import { PenaltyHistory } from './entity/penalty-history.entity';
import { CreatePenaltyPolicyDto } from './dto/create-penalty-policy.dto';
import { UpdatePenaltyPolicyDto } from './dto/update-penalty-policy.dto';
import { CreatePenaltyHistoryDto } from './dto/create-penalty-history.dto';
import { UpdatePenaltyHistoryDto } from './dto/update-penalty-history.dto';
import { Reservation } from '../user/entity/reservation.entity';

@Injectable()
export class PenaltyService {
  constructor(
    @InjectRepository(PenaltyPolicy)
    private readonly policyRepository: Repository<PenaltyPolicy>,
    @InjectRepository(PenaltyHistory)
    private readonly historyRepository: Repository<PenaltyHistory>,
  ) {}

  // ── PenaltyPolicy CRUD ─────────────────────────────────────────────────────

  createPolicy(dto: CreatePenaltyPolicyDto): Promise<PenaltyPolicy> {
    const policy = this.policyRepository.create(dto);
    return this.policyRepository.save(policy);
  }

  findAllPolicies(): Promise<PenaltyPolicy[]> {
    return this.policyRepository.find();
  }

  async findOnePolicy(penalty_policy_id: number): Promise<PenaltyPolicy> {
    const policy = await this.policyRepository.findOne({
      where: { penalty_policy_id },
    });
    if (!policy) {
      throw new NotFoundException(
        `PenaltyPolicy #${penalty_policy_id} not found`,
      );
    }
    return policy;
  }

  async updatePolicy(
    penalty_policy_id: number,
    dto: UpdatePenaltyPolicyDto,
  ): Promise<PenaltyPolicy> {
    const policy = await this.findOnePolicy(penalty_policy_id);
    Object.assign(policy, dto);
    return this.policyRepository.save(policy);
  }

  async removePolicy(penalty_policy_id: number): Promise<void> {
    const result = await this.policyRepository.delete({ penalty_policy_id });
    if (!result.affected) {
      throw new NotFoundException(
        `PenaltyPolicy #${penalty_policy_id} not found`,
      );
    }
  }

  // ── PenaltyHistory CRUD ────────────────────────────────────────────────────

  createHistory(dto: CreatePenaltyHistoryDto): Promise<PenaltyHistory> {
    const history = this.historyRepository.create({
      ...dto,
      reservation: { reservation_id: dto.reservation_id } as Reservation,
    });
    return this.historyRepository.save(history);
  }

  findAllHistories(): Promise<PenaltyHistory[]> {
    return this.historyRepository.find({ relations: ['reservation'] });
  }

  async findOneHistory(penalty_history_id: number): Promise<PenaltyHistory> {
    const history = await this.historyRepository.findOne({
      where: { penalty_history_id },
      relations: ['reservation'],
    });
    if (!history) {
      throw new NotFoundException(
        `PenaltyHistory #${penalty_history_id} not found`,
      );
    }
    return history;
  }

  findHistoriesByUser(user_id: number): Promise<PenaltyHistory[]> {
    return this.historyRepository.find({
      where: { reservation: { user: { user_id } } },
      relations: ['reservation'],
    });
  }

  findHistoriesByReservation(
    reservation_id: number,
  ): Promise<PenaltyHistory[]> {
    return this.historyRepository.find({
      where: { reservation: { reservation_id } },
      relations: ['reservation'],
    });
  }

  async updateHistory(
    penalty_history_id: number,
    dto: UpdatePenaltyHistoryDto,
  ): Promise<PenaltyHistory> {
    const history = await this.findOneHistory(penalty_history_id);
    Object.assign(history, dto);
    return this.historyRepository.save(history);
  }

  async removeHistory(penalty_history_id: number): Promise<void> {
    const result = await this.historyRepository.delete({ penalty_history_id });
    if (!result.affected) {
      throw new NotFoundException(
        `PenaltyHistory #${penalty_history_id} not found`,
      );
    }
  }
}
