import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, OtpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
