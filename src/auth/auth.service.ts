import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }
    if (user.is_active === 0) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const { password: _pw, ...userWithoutPassword } = user;
    const payload = { sub: user.user_id, type: 'user' };
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async loginAdmin(dto: LoginDto) {
    const admin = await this.adminService.findByEmail(dto.email);
    if (!admin || !admin.password) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }
    if (admin.is_active === 0) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const { password: _pw, ...adminWithoutPassword } = admin;
    const payload = {
      sub: admin.admin_id,
      type: 'admin',
    };
    return {
      access_token: this.jwtService.sign(payload),
      admin: adminWithoutPassword,
    };
  }
}
