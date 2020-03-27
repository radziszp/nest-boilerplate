import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserObject } from '@user/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserObject => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
