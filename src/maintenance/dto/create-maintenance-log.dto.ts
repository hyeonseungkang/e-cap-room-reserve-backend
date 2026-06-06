import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceLogDto {
  @ApiProperty()
  room_id: number;

  @ApiProperty()
  admin_id?: number;

  @ApiProperty()
  maintenance_type?: string;

  @ApiProperty()
  maintenance_status?: string;
}
