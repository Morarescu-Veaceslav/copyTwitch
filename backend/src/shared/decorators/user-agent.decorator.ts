import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    let userAgent = '';

    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<Request>();
      userAgent = request.headers['user-agent'] ?? '';
    } else {
      const context = GqlExecutionContext.create(ctx);
      const request = context.getContext().req as Request;
      userAgent = request.headers['user-agent'] ?? '';
    }

    return userAgent;
  },
);
