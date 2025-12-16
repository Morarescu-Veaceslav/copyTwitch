import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType, type User } from '@prisma/generated';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { destroySession } from 'src/shared/utils/session.util';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { verify } from 'argon2';
import { TelegramService } from 'src/modules/libs/telegram/telegram.service';
import { RedisService } from 'src/core/redis/redis.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class DeactivateService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService,
    ) { }

    public async deactivate(
        req: Request,
        input: DeactivateAccountInput,
        user: User,
        userAgent: string
    ) {
        const { email, password, pin } = input

        if (user.email !== email) {
            throw new GraphQLError('Incorrect email address.', {
                extensions: {
                    code: 'DEACTIVATE_ACCOUNT_ERROR',
                },
            });
        }

        const isValidPassword = await verify(user.password, password)

        if (!isValidPassword) {
            throw new GraphQLError('Incorrect password.', {
                extensions: {
                    code: 'DEACTIVATE_ACCOUNT_ERROR',
                },
            });
        }

        if (!pin) {
            await this.sendDeactivateToken(req, user, userAgent)
            return { message: 'Verification code required.' }
        }

        await this.validateDeactivateToken(req, pin)

        return { user }
    }


    private async validateDeactivateToken(req: Request, token: string) {

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        if (!existingToken) {
            throw new GraphQLError('Token not found.', {
                extensions: {
                    code: 'DEACTIVATE_ACCOUNT_ERROR',
                },
            });
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new GraphQLError('Token has expired.', {
                extensions: {
                    code: 'DEACTIVATE_ACCOUNT_ERROR',
                },
            });
        }

        if (!existingToken.userId) {
            throw new GraphQLError('Token is not associated with any user.', {
                extensions: {
                    code: 'DEACTIVATE_ACCOUNT_ERROR',
                },
            });
        }

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isDeactivated: true,
                deactivatedAt: new Date()
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        await this.clearSession(user.id)

        return destroySession(req, this.configService)
    }


    private async sendDeactivateToken(
        req: Request,
        user: User,
        userAgent: string
    ) {

        const deactivateToken = await generateToken(
            this.prismaService,
            user,
            TokenType.DEACTIVATE_ACCOUNT,
            false
        )

        const metadata = getSessionMetadata(req, userAgent)

        await this.mailService.sendDeactivateToken(
            user.email,
            deactivateToken.token,
            metadata
        )

        if (deactivateToken?.user?.notificationSettings?.telegramNotifications && deactivateToken.user.telegramId) {
            await this.telegramService.sendDeactivateToken(deactivateToken.user.telegramId, deactivateToken.token, metadata)
        }

        return true
    }


    private async clearSession(userId: string) {

        const keys = await this.redisService.client.keys('*')

        for (const key of keys) {

            const sessionData = await this.redisService.client.get(key)

            if (sessionData) {
                const session = JSON.parse(sessionData)
                if (session.userId === userId) {
                    await this.redisService.client.del(key)
                }
            }

        }
    }

}
