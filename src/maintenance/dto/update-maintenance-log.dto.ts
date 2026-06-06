import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaintenanceLogDto {
  @ApiProperty()
  admin_id?: number;

  @ApiProperty()
  maintenance_type?: string;

  @ApiProperty()
  maintenance_status?: string;
}
