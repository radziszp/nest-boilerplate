import { createParamDecorator } from '@nestjs/common';
import { UserObject } from '@user/interfaces';

export const User = createParamDecorator(
  (data: unknown, req): UserObject => req.user,
);
