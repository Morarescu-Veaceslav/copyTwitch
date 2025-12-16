import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SendMessageInput } from './inputs/send-message.input';
import { connect } from 'http2';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { User } from '@prisma/generated';
import { GraphQLError } from 'graphql';

@Injectable()
export class ChatService {
    public constructor(private readonly prismaService: PrismaService) { }

    public async findByStream(streamId: string) {
        const messages = await this.prismaService.chatMessage.findMany({
            where: {
                streamId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        })

        return messages
    }

    public async sendMessage(
        userId: string,
        input: SendMessageInput
    ) {
        const { text, streamId } = input

        const stream = await this.prismaService.stream.findUnique({
            where: {
                id: streamId
            }
        })

        if (!stream) {
            //throw new NotFoundException('Stream not found.')
            throw new GraphQLError('Stream not found.', {
                extensions: {
                    code: 'CHAT_SEND_MESSAGE_ERROR',
                },
            });
        }

        if (!stream.isLive) {
            //throw new BadRequestException('Stream is not live.')
            throw new GraphQLError('Stream is not live.', {
                extensions: {
                    code: 'CHAT_SEND_MESSAGE_ERROR',
                },
            });
        }

        const message = await this.prismaService.chatMessage.create({
            data: {
                text,
                user: {
                    connect: {
                        id: userId
                    }
                },
                stream: {
                    connect: {
                        id: stream.id
                    }
                }
            },
            include: {
                stream: true,
                user: true
            }
        })

        return message
    }


    public async changeSettings(user: User, input: ChangeChatSettingsInput) {
        const {
            isChatEnabled,
            isChatFollowersOnly,
            isChatPremiumFollowersOnly
        } = input

        await this.prismaService.stream.update({
            where: {
                userId: user.id
            },
            data: {
                isChatEnabled,
                isChatFollowersOnly,
                isChatPremiumFollowersOnly
            }
        })

        return true
    }
}
