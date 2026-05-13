import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  department?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  role?: string;
}
