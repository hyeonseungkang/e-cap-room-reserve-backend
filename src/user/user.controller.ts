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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ── User CRUD ──────────────────────────────────────────────────────────────

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // ── Reservation CRUD ───────────────────────────────────────────────────────

  @Post(':userId/reservations')
  createReservation(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateReservationDto,
  ) {
    return this.userService.createReservation(userId, dto);
  }

  @Get(':userId/reservations')
  findAllReservations(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findAllReservations(userId);
  }

  @Get('reservations/:reservationId')
  findOneReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.userService.findOneReservation(reservationId);
  }

  @Patch('reservations/:reservationId')
  updateReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.userService.updateReservation(reservationId, dto);
  }

  @Delete('reservations/:reservationId')
  removeReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.userService.removeReservation(reservationId);
  }
}
