import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
// Add these imports for Redis session store
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Trust proxy for secure cookies
  app.set('trust proxy', 1);

  // Configure cookie parser middleware
  app.use(cookieParser());

  // Create Redis client
  const redisClient = createClient({
    url: process.env.REDIS_URL, // e.g. 'redis://default:password@host:port'
  });
  await redisClient.connect();

  const store = new RedisStore({ client: redisClient });

  // Configure session middleware to use Redis
  app.use(
    session({
      store: store,
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
