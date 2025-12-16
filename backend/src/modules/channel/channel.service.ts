import { Injectable, NotFoundException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ChannelService {
    public constructor(private readonly prismaSerice: PrismaService) { }

    public async findRecommended() {
        const channels = await this.prismaSerice.user.findMany({
            where: {
                isDeactivated: false
            },
            orderBy: {
                followings: {
                    _count: 'desc'
                }
            },
            include: {
                stream: true
            },
            take: 7
        })

        return channels

    }

    public async findByUsername(username: string) {
        const channel = await this.prismaSerice.user.findUnique({
            where: {
                username,
                isDeactivated: false
            },
            include: {
                socialLinks: {
                    orderBy: {
                        position: 'asc'
                    }
                },
                stream: {
                    include: {
                        category: true
                    }
                },
                followings: true,
                sponsorshipPlans: true,
                sponsorshipSubstriptions: true
            }
        })

        if (!channel) {
            throw new GraphQLError('Channel not found.', {
                extensions: {
                    code: 'CHANNEL_NOT_FOUND',
                },
            });
        }

        return channel
    }

    public async findFollowersCountByChannel(channelId: string) {
        const count = await this.prismaSerice.follow.count({
            where: {
                following: {
                    id: channelId
                }
            }
        })

        return count
    }


    public async findSponsorsByChannel(channelId: string) {

        const channel = await this.prismaSerice.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new NotFoundException('Channel not found.')
        }
        const sponsor = await this.prismaSerice.sponsorshipSubstription.findMany({
            where: {
                channelId: channel.id
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
