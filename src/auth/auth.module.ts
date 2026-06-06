import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [
    UserModule,
    AdminModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'ecap-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
