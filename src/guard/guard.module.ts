import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'ecap-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AdminGuard, UserGuard],
  exports: [AdminGuard, UserGuard, JwtModule],
})
export class GuardModule {}
