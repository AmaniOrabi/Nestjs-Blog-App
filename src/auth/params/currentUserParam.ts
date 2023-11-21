import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUserParam = createParamDecorator<
  unknown,
  ExecutionContext,
  string
>((_, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
