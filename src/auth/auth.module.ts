import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth/auth.controller';
import { AuthService } from './service/auth/auth.service';
import { UserService } from 'src/user/service/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStraregy } from './strategy/google.strategy';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from 'src/config/google.oauth.config';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    ConfigModule.forFeature(googleOauthConfig),
  ],
  exports: [AuthService, GoogleStraregy],
  controllers: [AuthController],
  providers: [AuthService, GoogleStraregy],
})
export class AuthModule {}
