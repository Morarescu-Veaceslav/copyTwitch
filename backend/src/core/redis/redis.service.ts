import { Injectable } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
    public client: Redis;

    constructor(private readonly configService: ConfigService) {
        this.client = new IORedis(this.configService.getOrThrow<string>('REDIS_URL'));
    }
}
