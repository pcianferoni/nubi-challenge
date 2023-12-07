import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from '../../user/services/user.service';
import { PUBLIC_KEY, OWN_USER_KEY, REGISTERED_USER_KEY } from '../../constants/key-decorator';
import { tokenDecoder } from '../../utils/token-decoder';
import { ITokenDecoder } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    /* verify that the endpoint is public */
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());
    /* verify that the endpoint is only available for owner user. */
    const isOnlyAvailableToOwnerUser = this.reflector.get<boolean>(
      OWN_USER_KEY,
      context.getHandler(),
    );
    /* verify that the endpoint is only available for a registered user. */
    const isUserRegisteredRequired = this.reflector.get<boolean>(
      REGISTERED_USER_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) throw new UnauthorizedException('Missing token');
    const [, token] = bearerToken.split(' ');

    if (!token || Array.isArray(token)) throw new UnauthorizedException('Invalid token');
    const decodedToken: ITokenDecoder | string = tokenDecoder(token);
    if (typeof decodedToken === 'string') throw new UnauthorizedException(decodedToken);
    if (decodedToken.isExpired) throw new UnauthorizedException('Token expired');

    const user = await this.userService.findByEmail(decodedToken.email);

    if (isUserRegisteredRequired && user) {
      return true;
    } else if (isOnlyAvailableToOwnerUser && user?.email === req.params?.email) {
      return true;
    }
    if (!user) throw new UnauthorizedException('Invalid user');
    return false;
  }
}
