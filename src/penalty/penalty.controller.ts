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
import { PenaltyService } from './penalty.service';
import { CreatePenaltyPolicyDto } from './dto/create-penalty-policy.dto';
import { UpdatePenaltyPolicyDto } from './dto/update-penalty-policy.dto';
import { CreatePenaltyHistoryDto } from './dto/create-penalty-history.dto';
import { UpdatePenaltyHistoryDto } from './dto/update-penalty-history.dto';

@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  // ── PenaltyPolicy ──────────────────────────────────────────────────────────

  @Post('policies')
  createPolicy(@Body() dto: CreatePenaltyPolicyDto) {
    return this.penaltyService.createPolicy(dto);
  }

  @Get('policies')
  findAllPolicies() {
    return this.penaltyService.findAllPolicies();
  }

  @Get('policies/:id')
  findOnePolicy(@Param('id', ParseIntPipe) id: number) {
    return this.penaltyService.findOnePolicy(id);
  }

  @Patch('policies/:id')
  updatePolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePenaltyPolicyDto,
  ) {
    return this.penaltyService.updatePolicy(id, dto);
  }

  @Delete('policies/:id')
  removePolicy(@Param('id', ParseIntPipe) id: number) {
    return this.penaltyService.removePolicy(id);
  }

  // ── PenaltyHistory ─────────────────────────────────────────────────────────

  @Post('history')
  createHistory(@Body() dto: CreatePenaltyHistoryDto) {
    return this.penaltyService.createHistory(dto);
  }

  @Get('history')
  findAllHistories() {
    return this.penaltyService.findAllHistories();
  }

  @Get('history/:id')
  findOneHistory(@Param('id', ParseIntPipe) id: number) {
    return this.penaltyService.findOneHistory(id);
  }

  @Get('history/reservation/:reservationId')
  findHistoriesByReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.penaltyService.findHistoriesByReservation(reservationId);
  }

  @Patch('history/:id')
  updateHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePenaltyHistoryDto,
  ) {
    return this.penaltyService.updateHistory(id, dto);
  }

  @Delete('history/:id')
  removeHistory(@Param('id', ParseIntPipe) id: number) {
    return this.penaltyService.removeHistory(id);
  }
}
