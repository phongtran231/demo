import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from 'src/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivePermissions = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!canActivePermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt_secret'),
      });
      const { role } = payload;
      if (role.name === 'admin') {
        return true;
      }
      const permissions = await this.userService.getPermissionsByRole(role);
      let isValidPermission = false;
      permissions.map((permission) => {
        if (canActivePermissions.includes(permission.name)) {
          isValidPermission = true;
        }
      });
      if (!isValidPermission) {
        throw new UnauthorizedException();
      }
      return isValidPermission;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token: string = request.headers['x-token']
      ? request.headers['x-token'].toString()
      : null;
    return token ?? null;
  }
}
