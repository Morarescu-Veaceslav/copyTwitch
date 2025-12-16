import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { FiltersInput } from './inputs/filters.input';
import type { Prisma, User } from '@prisma/generated';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FileUpload } from 'graphql-upload';
import sharp from 'sharp';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import { StorageService } from '../libs/storage/storage.service';

@Injectable()
export class StreamService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly storageService: StorageService
    ) { }

    public async findAll(input: FiltersInput = {}) {

        const { take, skip, searchTerm } = input

        const whereClause = searchTerm ? this.findBySearchTermFilter(searchTerm) : undefined

        const stream = await this.prismaService.stream.findMany({

            take: take ?? 12,
            skip: skip ?? 0,
            where: {
                user: {
                    isDeactivated: false
                },
                ...whereClause
            },
            include: {
                user: true,
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return stream
    }

    public async findRandom() {

        const total = await this.prismaService.stream.count({
            where: {
                user: {
                    isDeactivated: false
                },
            }
        })


        const randomIndexes = new Set<number>()

        while (randomIndexes.size < total) {
            const randomIndex = Math.floor(Math.random() * total)
            randomIndexes.add(randomIndex)
        }

        const streams = await this.prismaService.stream.findMany({
            where: {
                user: {
                    isDeactivated: false
                }
            },
            include: {
                user: true,
                category: true
            },
            take: total,
            skip: 0
        })

        return Array.from(randomIndexes).map(index => streams[index])
    }

    public async changeInfo(user: User, input: ChangeStreamInfoInput) {
        const { title, categoryId } = input

        await this.prismaService.stream.update({
            where: {
                userId: user.id,
            },
            data: {
                title,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })

        return true
    }

    public async changeThumbnail(user: User, file: Promise<FileUpload>) {
        const { createReadStream, thumbnail } = await file;

        const stream = createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const fileName = `${user.username}`;
        let processedBuffer: Buffer;
        processedBuffer = await sharp(buffer)
            .rotate()
            .resize(1280, 720)
            .jpeg({ quality: 80 })
            .toBuffer();

        const upload = await this.storageService.uploadImage(processedBuffer, fileName, 'streams');

        const thumbnailValue = `v${upload.version}/${upload.public_id}`;

        await this.prismaService.stream.update({
            where: { userId: user.id },
            data: {
                thumbnailUrl: thumbnailValue,
            },
        });

        return true;
    }


    public async removeThumbnail(user: User) {

        const stream = await this.findByUserId(user)

        if (!stream?.thumbnailUrl) {
            return
        }
        this.storageService.deleteImage(stream.thumbnailUrl)
        
        await this.prismaService.stream.update({
            where: {
                userId: user.id
            },
            data: {
                thumbnailUrl: null,
            }
        })

        return true
    }

    public async generateToken(input: GenerateStreamTokenInput) {
        const { userId, channelId } = input

        let self: { id: string, username: string }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if (user) {
            self = { id: user.id, username: user.username }
        } else {
            self = {
                id: userId,
                username: `Watcher ${Math.floor(Math.random() * 1000)}`
            }
        }

        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new NotFoundException('Channel not found.')
        }

        const isHost = self.id === channel.id

        const token = new AccessToken(
            this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
            this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
            {
                identity: isHost ? `Host-${self.id}` : self.id.toString(),
                name: self.username
            }
        )

        token.addGrant({
            room: channel.id,
            roomJoin: true,
            canPublish: false
        })

        return { token: token.toJwt() }
    }


    private async findByUserId(user: User) {
        const stream = await this.prismaService.stream.findUnique({
            where: {
                userId: user.id
            }
        })

        return stream
    }



    private findBySearchTermFilter(
        searchTerm: string,
    ): Prisma.StreamWhereInput {
        const lower = searchTerm.toLowerCase();
        return {
            OR: [
                {
                    title: {
                        contains: lower,
                    }
                },
                {
                    user: {
                        username: {
                            contains: lower,
                        }
                    }
                },
                {
                    category: {
                        title: {
                            contains: lower
                        }
                    }
                }
            ]
        }
    }
}
