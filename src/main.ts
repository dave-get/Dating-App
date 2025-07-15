import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';(session)

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure Redis client
  const redisClient = new Redis()
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Trust proxy for secure cookies
  app.set('trust proxy', 1);

  // Configure cookie parser middleware
  app.use(cookieParser());

  // Configure session middleware to use Redis
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        ttl: 86400, // 24 hours
      }),
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
