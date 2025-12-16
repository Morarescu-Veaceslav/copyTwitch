import { Injectable } from '@nestjs/common';
import { NotificationType, type SponsorshipPlan, TokenType, type User } from '@prisma/generated';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input';
import { generateToken } from 'src/shared/utils/generate-token.util';

@Injectable()
export class NotificationService {
    public constructor(private readonly prismaService: PrismaService) { }

    public async findUnreadCount(user: User) {
        const count = await this.prismaService.notification.count({
            where: {
                isRead: false,
                userId: user.id
            }
        })

        return count
    }

    public async findByUser(user: User) {

        await this.prismaService.notification.updateMany({
            where: {
                isRead: false,
                userId: user.id
            },
            data: {
                isRead: true
            }
        })

        const notifications = await this.prismaService.notification.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return notifications
    }


    public async createStreamStart(userId: string, channel: User) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `<b className='font-medium'>Don't miss!</b>
            <p>Join this channel's stream <a href='/${channel.username}' 
            className='font-semibold'>${channel.displayName}</a></p>`,
                type: NotificationType.STREAM_START,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification
    }

    public async createNewFollowing(userId: string, follower: User) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `<b className='font-medium'>You have a new follower!</b>
                <p>This follower <a href='/${follower.username}' className='font-semibold'>${follower.displayName}</a></p>`,
                type: NotificationType.NEW_FOLLOWER,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification
    }


    public async createNewSponsorship(
        userId: string,
        plan: SponsorshipPlan,
        sponsor: User
    ) {

        const notification = await this.prismaService.notification.create({
            data: {
                message: `
                <b className='font-medium'>You have a new sponsor!</b>
                <p>
                  User <a href="/${sponsor.username}" className="font-semibold">${sponsor.displayName}</a> 
                  has just become your sponsor on the plan <strong>${plan.title}</strong>!
                </p>
                <p>Thank you for creating amazing content.</p>
              `,
                type: NotificationType.NEW_SPONSORSHIP,
                user: {
                    connect: { id: userId }
                }
            }
        })

        return notification
    }

    public async createEnableTwoFactor(userId: string) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `
                <b class='font-medium text-lg'>🔐 Secure your account with Two-Factor Authentication</b>
                <p class='mt-2'>
                  Protect your TwitchTest account and keep your data safe by enabling <b>Two-Factor Authentication (2FA)</b>.
                  This adds an extra layer of security every time you log in.
                </p>
                <p class='mt-3 text-gray-600'>
                  We highly recommend enabling 2FA to keep your account secure from unauthorized access.
                </p>
              `,
                type: NotificationType.ENABLE_TWO_FACTOR,
                userId
            }
        })

        return notification
    }


    public async createVerifyChannel(userId: string) {
        await this.prismaService.notification.create({
            data: {
                message: `
              <b class='font-medium text-lg'>🎉 Congratulations! Your channel is now verified!</b>
              <p class='mt-2'>
                We're thrilled to let you know that <b>your channel has been successfully verified</b>.<br>
                You’ll now see a <b>verified badge</b> (✔️) next to your channel name,  
                symbolizing authenticity and trust for your followers.
              </p>
              <p class='mt-2'>
                Thank you for being part of our community and helping <b>TwitchTest</b> grow with your amazing content!
              </p>
              <p class='mt-3'>
                Keep creating, inspiring, and enjoying the benefits of being a verified creator. 🚀
              </p>
            `,
                type: NotificationType.VERIFIED_CHANNEL,
                userId
            }
        })
    }



    public async changeSettings(
        user: User,
        input: ChangeNotificationsSettingsInput
    ) {
        const { siteNotifications, telegramNotifications } = input

        const notificationSettings = await this.prismaService.notificationSettings.upsert({
            where: {
                userId: user.id
            },
            create: {
                siteNotifications,
                telegramNotifications,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            },
            update: {
                siteNotifications,
                telegramNotifications
            },
            include: {
                user: true
            }
        })

        if (notificationSettings.telegramNotifications && !notificationSettings.user?.telegramId) {
            const telegramAuthToken = await generateToken(
                this.prismaService,
                user,
                TokenType.TELEGRAM_AUTH
            )

            return {
                notificationSettings,
                telegramAuthToken: telegramAuthToken.token
            }
        }

        if (!notificationSettings.telegramNotifications && notificationSettings.user?.telegramId) {
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    telegramId: null
                }
            })

            return {
                notificationSettings
            }
        }
        return {
            notificationSettings
        }
    }
}
