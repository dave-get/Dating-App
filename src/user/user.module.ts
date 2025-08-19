import { Module } from '@nestjs/common';
import { UserService } from './service/user/user.service';
import { UserController } from './controller/user/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryService } from './service/cloudinary/cloudinary.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, CloudinaryService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
