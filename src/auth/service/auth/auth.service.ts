import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user/user.service';
import { GoogleAuthDto } from '../../dtos/googleAuth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

}
