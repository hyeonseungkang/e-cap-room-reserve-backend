import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiProperty()
  start_time?: Date;

  @ApiProperty()
  end_time?: Date;

  @ApiProperty()
  participant_count?: number;

  @ApiProperty()
  purpose?: string;

  @ApiProperty()
  reservation_status?: string;
}
