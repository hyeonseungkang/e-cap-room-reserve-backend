import { ApiProperty } from '@nestjs/swagger';

export class CreatePenaltyHistoryDto {
  @ApiProperty()
  reservation_id: number;

  @ApiProperty()
  start_date?: Date;

  @ApiProperty()
  end_date?: Date;
}
