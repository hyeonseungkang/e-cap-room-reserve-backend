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
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      const payload = this.jwtService.verify<Payload>(
        String(request.headers['authorization']),
      );
      if (payload.type === 'admin') {
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException('관리자 이상의 권한이 필요합니다.');
    }
    return false;
  }
}
