import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/generated';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
    public constructor(private readonly prismaService: PrismaService) { }

    public async findMySponsors(user: User) {

        const sponsor = await this.prismaService.sponsorshipSubstription.findMany({
            where: {
                channelId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                plan: true,
                user: true,
                channel: true
            }
        })

        return sponsor
    }
}
