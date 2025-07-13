import { Module } from '@nestjs/common';
import { UserService } from './service/user/user.service';
import { UserController } from './controller/user/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
