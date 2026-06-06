import { ApiProperty } from '@nestjs/swagger';

export class UpdatePenaltyHistoryDto {
  @ApiProperty()
  start_date?: Date;

  @ApiProperty()
  end_date?: Date;
}
