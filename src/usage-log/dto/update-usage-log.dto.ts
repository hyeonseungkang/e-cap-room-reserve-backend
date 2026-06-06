import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsageLogDto {
  @ApiProperty()
  check_in_time?: Date;

  @ApiProperty()
  check_out_time?: Date;

  @ApiProperty()
  usage_status?: string;
}
