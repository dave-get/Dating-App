import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, OtpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
