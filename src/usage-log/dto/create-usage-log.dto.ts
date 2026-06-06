import { ApiProperty } from '@nestjs/swagger';

export class CreateUsageLogDto {
  @ApiProperty()
  reservation_id: number;

  @ApiProperty()
  check_in_time?: Date;

  @ApiProperty()
  check_out_time?: Date;

  @ApiProperty()
  usage_status?: string;
}
