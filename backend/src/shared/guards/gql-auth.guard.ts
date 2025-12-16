import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { PrismaService } from "src/core/prisma/prisma.service";


@Injectable()
export class GqlAuthGuard implements CanActivate {
    public constructor(private readonly prismaService: PrismaService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req
    
        if (typeof request.session.userId === 'undefined') {
            throw new UnauthorizedException('You do not have the required permission. Please log in.')
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: request.session.userId
            }
        })

        request.user = user

        return true
    }
}