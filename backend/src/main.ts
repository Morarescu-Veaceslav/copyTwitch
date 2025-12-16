import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import cookieParser from 'cookie-parser'
import { parseMs, type StringValue } from './shared/utils/ms.util'
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { RedisService } from './core/redis/redis.service';
import connectRedis from 'connect-redis';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(CoreModule, {
    rawBody: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  //const app2 = await NestFactory.create(AppModule, { rawBody: true });

  const config = app.get(ConfigService)

  const redisService = app.get(RedisService);
  const RedisStore = connectRedis(session);

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))


  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: parseMs(config.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: false, // obligatoriu false pentru localhost
        sameSite: 'lax', // dacă frontend e pe același port; dacă e pe alt port -> 'none'
      },
      store: new RedisStore({
        client: redisService.client,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
        disableTouch: true,
      }),
    }),
  );

  app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }))

  await app.listen(Number(config.get('APPLICATION_PORT')) ?? 4000);

}

bootstrap();
