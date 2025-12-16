import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/generated';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class FollowService {
    public constructor(private readonly prismaSerivce: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly telegramService: TelegramService
    ) { }


    public async findMyFollowers(user: User) {
        const followers = await this.prismaSerivce.follow.findMany({
            where: {
                followingId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                follower: true
            }
        })

        return followers
    }

    public async findMyFollowings(user: User) {
        const followings = await this.prismaSerivce.follow.findMany({
            where: {
                followerId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                following: true
            }
        })

        return followings
    }


    public async follow(user: User, channelId: string) {
        const channel = await this.prismaSerivce.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new GraphQLError('Channel not found.', {
                extensions: {
                    code: 'FOLLOW_ERROR'
                }
            });
        }

        if (channel.id === user.id) {
            throw new GraphQLError('You cannot subscribe to yourself.', {
                extensions: {
                    code: 'FOLLOW_ERROR'
                }
            });
        }

        const existingFollow = await this.prismaSerivce.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        if (existingFollow) {
            throw new GraphQLError('You are already subscribed to this channel.', {
                extensions: {
                    code: 'FOLLOW_ERROR'
                }
            });
        }

        const follow = await this.prismaSerivce.follow.create({
            data: {
                followerId: user.id,
                followingId: channel.id
            },
            include: {
                follower: true,
                following: {
                    include: {
                        notificationSettings: true
                    }
                }
            }
        })

        if (follow.following.notificationSettings?.siteNotifications) {
            await this.notificationService.createNewFollowing(
                follow.following.id,
                follow.follower
            )
        }

        if (follow.following.notificationSettings?.telegramNotifications && follow.following.telegramId) {
            await this.telegramService.sendNewFollowing(follow.following.telegramId, follow.follower)
        }

        return true
    }



    public async unFollow(user: User, channelId: string) {
        const channel = await this.prismaSerivce.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new GraphQLError('Channel not found.', {
                extensions: {
                    code: 'UNFOLLOW_ERROR'
                }
            });
        }

        if (channel.id === user.id) {
            throw new GraphQLError('You cannot subscribe to yourself.', {
                extensions: {
                    code: 'UNFOLLOW_ERROR'
                }
            });
        }

        const existingFollow = await this.prismaSerivce.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        if (!existingFollow) {
            throw new GraphQLError('You are not subscribed to this channel.', {
                extensions: {
                    code: 'UNFOLLOW_ERROR'
                }
            });
        }

        await this.prismaSerivce.follow.delete({
            where: {
                id: existingFollow.id,
                followerId: user.id,
                followingId: channel.id
            }
        })

        return true
    }
}
