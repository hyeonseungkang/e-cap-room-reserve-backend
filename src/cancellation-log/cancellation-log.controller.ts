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
import { CancellationLogService } from './cancellation-log.service';
import { CreateCancellationLogDto } from './dto/create-cancellation-log.dto';
import { UpdateCancellationLogDto } from './dto/update-cancellation-log.dto';

@Controller('cancellation-log')
export class CancellationLogController {
  constructor(
    private readonly cancellationLogService: CancellationLogService,
  ) {}

  @Post()
  create(@Body() dto: CreateCancellationLogDto) {
    return this.cancellationLogService.create(dto);
  }

  @Get()
  findAll() {
    return this.cancellationLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cancellationLogService.findOne(id);
  }

  @Get('reservation/:reservationId')
  findByReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.cancellationLogService.findByReservation(reservationId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCancellationLogDto,
  ) {
    return this.cancellationLogService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cancellationLogService.remove(id);
  }
}
