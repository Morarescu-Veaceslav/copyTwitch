import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { RedisService } from 'src/core/redis/redis.service';
import { UserSession } from 'src/shared/types/user-session.type';
import { destroySession, saveSession } from 'src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';
import { TOTP } from 'otpauth'
import { GraphQLError } from 'graphql';


@Injectable()
export class SessionService {
    public constructor(private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly verificationService: VerificationService
    ) { }

    public async findByUser(req: Request) {
        const userId = req.session.userId;
        if (!userId) {
            //throw new NotFoundException('User not found.');
            throw new GraphQLError('User not found.', {
                extensions: {
                    code: 'USER_NOT_FOUND_ERROR',
                },
            });
        }

        const keys = await this.redisService.client.keys('*');
        const userSessions: UserSession[] = [];

        for (const key of keys) {
            const sessionData = await this.redisService.client.get(key);
            if (!sessionData) continue;

            try {
                const session = JSON.parse(sessionData);
                if (session.userId === userId) {
                    userSessions.push({ ...session, id: key.split(':')[1] });
                }
            } catch {
                continue;
            }
        }

        userSessions.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return userSessions.filter(session => session.id !== req.session.id);
    }

    public async findCurrent(req: Request) {
        const sessionId = req.session.id

        const sessionData = await this.redisService.client.get(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`)

        if (!sessionData) {
            throw new GraphQLError('Session not found.', {
                extensions: {
                    code: 'SESSION_NOT_FOUND_ERROR',
                },
            });
        }

        const session = JSON.parse(sessionData)

        return {
            ...session,
            id: sessionId
        }
    }


    public async login(req: Request, input: LoginInput, userAgent: string) {
        const { login, password, pin } = input

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { username: { equals: login } },
                    { email: { equals: login } }
                ]
            }
        })

        if (!user || user.isDeactivated) {
            //throw new NotFoundException('User not found.')
            throw new GraphQLError('User not found.', {
                extensions: {
                    code: 'LOGIN_ERROR',
                },
            });
        }

        const isValidPassword = await verify(user.password, password)

        if (!isValidPassword) {
            //throw new UnauthorizedException('Incorrect password')
            throw new GraphQLError('Incorrect password', {
                extensions: {
                    code: 'LOGIN_ERROR',
                },
            });
        }

        if (!user.isEmailVerified) {
            await this.verificationService.sendVerificationToken(user)
            //throw new BadRequestException('Your email address is not verified. Please check your email inbox — we have sent a new confirmation link.')
            throw new GraphQLError('Your email address is not verified. Please check your email inbox — we have sent a new confirmation link.', {
                extensions: {
                    code: 'LOGIN_ERROR',
                },
            });
        }

        if (user.isTotpEnabled) {
            if (!pin) {
                return {
                    message: 'TOTP authentication code is required to continue.'
                }
            }

            if (!user.totpSecret) {
                //throw new BadRequestException('TOTP secret is missing for this user.');
                throw new GraphQLError('TOTP secret is missing for this user.', {
                    extensions: {
                        code: 'LOGIN_ERROR',
                    },
                });

            }

            const totp = new TOTP({
                issuer: 'TwithTest',
                label: `${user.email}`,
                algorithm: 'SHA1',
                digits: 6,
                secret: user.totpSecret
            })

            const delta = totp.validate({ token: pin })

            if (delta === null) {
                //throw new BadRequestException('The TOTP code is invalid or has expired.')
                throw new GraphQLError('The TOTP code is invalid or has expired.', {
                    extensions: {
                        code: 'LOGIN_ERROR',
                    },
                });
            }

        }

        const metadata = getSessionMetadata(req, userAgent)

        return saveSession(req, user, metadata)
    }

    public async logout(req: Request) {
        return destroySession(req, this.configService)
    }


    public async clearSession(req: Request) {
        req.res?.clearCookie(
            this.configService.getOrThrow<string>('SESSION_NAME')
        )
        return true
    }

    public async remove(req: Request, id: string) {
        if (req.session.id === id) {
            throw new GraphQLError('You cannot delete the current session.', {
                extensions: {
                    code: 'SESSION_REMOVE_ERROR',
                },
            });
        }

        await this.redisService.client.del(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`)

        return true
    }
}
