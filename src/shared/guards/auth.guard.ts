import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as _AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends _AuthGuard('jwt') {
  constructor(private canNext: boolean) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || (!user && !this.canNext)) {
      const errorMessage = err ? err.message || 'Unauthorized' : 'Unauthorized';
      throw new UnauthorizedException(errorMessage);
    }
    return user || null;
  }
}

export function authGuard(canNext: boolean) {
  return new AuthGuard(canNext);
}
