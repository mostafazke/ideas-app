import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

interface IRequest extends Request {
  user: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    request.user = await this.validateToken(request.headers.authorization);

    return true;
  }

  async validateToken(auth: string): Promise<any> {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('invalid token', HttpStatus.FORBIDDEN);
    }
    const token = auth.split(' ')[1];

    try {
      const user = verify(token, process.env.SECRET);
      return user;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
