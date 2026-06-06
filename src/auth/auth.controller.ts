import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/login')
  loginUser(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  @Post('admin/login')
  loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto);
  }
}
