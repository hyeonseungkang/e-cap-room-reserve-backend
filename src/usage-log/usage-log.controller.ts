import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsageLogService } from './usage-log.service';
import { CreateUsageLogDto } from './dto/create-usage-log.dto';
import { UpdateUsageLogDto } from './dto/update-usage-log.dto';
import { AdminGuard } from '../guard/admin.guard';

@Controller('usage-log')
export class UsageLogController {
  constructor(private readonly usageLogService: UsageLogService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateUsageLogDto) {
    return this.usageLogService.create(dto);
  }

  @Get()
  findAll() {
    return this.usageLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usageLogService.findOne(id);
  }

  @Get('reservation/:reservationId')
  findByReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.usageLogService.findByReservation(reservationId);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsageLogDto,
  ) {
    return this.usageLogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usageLogService.remove(id);
  }
}
