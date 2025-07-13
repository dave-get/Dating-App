import { Module } from '@nestjs/common';
import { OtpController } from './controller/otp/otp.controller';
import { OtpService } from './service/otp/otp.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [OtpController],
  providers: [OtpService]
})
export class OtpModule {}
