import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { hash, verify } from 'argon2';
import { VerificationService } from '../verification/verification.service';
import type { User } from '@prisma/generated';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';
import { ChatService } from 'src/modules/chat/chat.service';
import { GraphQLError } from 'graphql';


@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService,
        private readonly verificationService: VerificationService,
    ) { }

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            },
            include: {
                socialLinks: true,
                notificationSettings: true,
                stream: true
            }
        })

        if (!user) return null;

        return user;
    }

    public async create(input: CreateUserInput) {

        const { username, email, password } = input

        const isUsernameExist = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if (isUsernameExist) {
            throw new GraphQLError('This username is already exist.', {
                extensions: {
                    code: 'USERNAME_ALREADY_EXIST',
                },
            });
        }

        const isEmailExist = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (isEmailExist) {
            throw new GraphQLError('This email is already exist.', {
                extensions: {
                    code: 'USERNAME_ALREADY_EXIST',
                },
            });
        }


        const user = await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                displayName: username,
                stream: {
                    create: {
                        title: `Stream ${username}`
                    }
                }
            }
        })

        await this.verificationService.sendVerificationToken(user)
        return true

    }


    public async changeEmail(user: User, input: ChangeEmailInput) {
        const { email } = input

        const existingUser = await this.prismaService.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new GraphQLError('This email address is already in use.', {
                extensions: {
                    code: 'EMAIL_ALREADY_EXIST',
                },
            });
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                email
            }
        })

        return true
    }


    public async changePassword(user: User, input: ChangePasswordInput) {
        const { oldPassword, newPassword } = input

        const isValidPassword = await verify(user.password, oldPassword)

        if (!isValidPassword) {
            throw new GraphQLError('Incorrect old password.', {
                extensions: {
                    code: 'INCORECT_OLD_PASSWORD',
                },
            });
        }


        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                password: await hash(newPassword)
            }
        })

        return true
    }

}
