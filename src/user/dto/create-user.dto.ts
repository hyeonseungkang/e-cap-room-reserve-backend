import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  department?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  is_active?: number;
}
