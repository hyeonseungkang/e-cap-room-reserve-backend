import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  department?: string;

  @ApiProperty()
  is_active?: number;
}
