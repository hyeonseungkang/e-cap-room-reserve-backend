import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        secret: process.env.JWT_CONSTRAINTS,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AdminGuard, UserGuard],
  exports: [AdminGuard, UserGuard, JwtModule],
})
export class GuardModule {}
