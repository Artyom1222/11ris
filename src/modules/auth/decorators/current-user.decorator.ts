import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayload } from '../../../interfaces/admin.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ITokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
