import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { TokenType } from '@prisma/generated';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { hash } from 'argon2';
import { TelegramService } from 'src/modules/libs/telegram/telegram.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class PasswordRecoveryService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService,
    ) { }


    public async resetPassword(
        req: Request,
        input: ResetPasswordInput,
        userAgent: string
    ) {
        const { email } = input

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            },
            include: {
                notificationSettings: true
            }
        })

        if (!user) {
            throw new GraphQLError('User not found.', {
                extensions: {
                    code: 'RESET_PASSWORD_ERROR',
                },
            });
        }

        const resetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET)

        const metadata = getSessionMetadata(req, userAgent)

        await this.mailService.sendPasswordResetToken(user.email, resetToken.token, metadata)

        if (user.notificationSettings?.telegramNotifications && user.telegramId) {
            await this.telegramService.sendPasswordResetToken(user.telegramId, resetToken.token, metadata)
        }

        return true
    }


    public async newPassword(input: NewPasswordInput) {
        const { password, token } = input

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        })

        if (!existingToken) {
            throw new GraphQLError('Token not found.', {
                extensions: {
                    code: 'NEW_PASSWORD_ERROR',
                },
            });
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {

            throw new GraphQLError('Token has expired.', {
                extensions: {
                    code: 'NEW_PASSWORD_ERROR',
                },
            });
        }

        if (!existingToken.userId) {
            throw new GraphQLError('Token is not associated with any user.', {
                extensions: {
                    code: 'NEW_PASSWORD_ERROR',
                },
            });
        }
        await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                password: await hash(password)
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true
    }

}
