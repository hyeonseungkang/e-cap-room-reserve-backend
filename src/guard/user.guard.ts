import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../auth/payload.interface';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      const payload = this.jwtService.verify<Payload>(
        String(request.headers['authorization']),
      );
      if (payload.type === 'user' || payload.type === 'admin') {
        return true;
      }
    } catch {
      throw new UnauthorizedException('사용자 이상의 권한이 필요합니다.');
    }
    return false;
  }
}
