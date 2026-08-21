import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = (request.headers['x-user-role'] || '').toLowerCase();

    if (!userRole) {
      throw new ForbiddenException('Missing x-user-role header');
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Role '${userRole}' does not have access. Required: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
